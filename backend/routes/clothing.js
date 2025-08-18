import express from 'express';
import auth from '../middleware/auth.js';
import Clothing from '../models/Clothing.js';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add clothing with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, category, color, brand, material, season, condition } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      // Upload file buffer to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'wardrobe-manager' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const clothing = new Clothing({
      user: req.user.userId,
      name,
      category,
      color,
      brand,
      material,
      season,
      condition,
      image: imageUrl,
    });
    await clothing.save();
    res.status(201).json(clothing);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add clothing', error: error.message });
  }
});



// Update clothing (wear, favorite, edit)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { wearCount, lastWorn, ...otherFields } = req.body;

    // Fetch existing clothing
    const clothing = await Clothing.findOne({ _id: req.params.id, user: req.user.userId });
    if (!clothing) return res.status(404).json({ message: 'Clothing not found' });

    // Append new wear date if wearCount & lastWorn provided
    let updatedWearHistory = clothing.wearHistory || [];
    if (wearCount !== undefined && lastWorn) {
      updatedWearHistory.push(new Date(lastWorn));
    }

    // Handle image upload if provided
    let imageUrl = clothing.image;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'wardrobe-manager' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    // Update clothing in DB
    const updatedClothing = await Clothing.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      {
        ...otherFields,
        image: imageUrl,
        wearCount: wearCount !== undefined ? wearCount : clothing.wearCount,
        lastWorn: lastWorn ? new Date(lastWorn) : clothing.lastWorn,
        wearHistory: updatedWearHistory,
      },
      { new: true }
    );

    res.json(updatedClothing);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update clothing', error: error.message });
  }
});




// Delete clothing
router.delete('/:id', auth, async (req, res) => {
  try {
    const clothing = await Clothing.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!clothing) return res.status(404).json({ message: 'Clothing not found' });
    if (clothing.image) {
      const publicId = clothing.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`wardrobe-manager/${publicId}`);
    }
    res.json({ message: 'Clothing deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete clothing', error: error.message });
  }
});

// Get all clothing
router.get('/', auth, async (req, res) => {
  try {
    const { category, color, season, condition, isFavorite } = req.query;
    const query = { user: req.user.userId, condition: { $nin: ['donated', 'sold', 'archived'] } };
    
    if (category) query.category = category;
    if (color) query.color = color;
    if (season) query.season = season;
    if (condition) query.condition = condition;
    if (isFavorite) query.isFavorite = isFavorite === 'true';

    const clothes = await Clothing.find(query);
    res.json(clothes);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch clothing', error: error.message });
  }
});

// Get analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const categoryCounts = await Clothing.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.userId), condition: { $nin: ['donated', 'sold', 'archived'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const mostWorn = await Clothing.find({ user: req.user.userId })
      .sort({ wearCount: -1 })
      .limit(5);

    const leastWorn = await Clothing.find({ user: req.user.userId })
      .sort({ wearCount: 1 })
      .limit(5);

    const notWornRecently = await Clothing.find({
      user: req.user.userId,
      lastWorn: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      condition: { $nin: ['donated', 'sold', 'archived'] },
    });

    res.json({ categoryCounts, mostWorn, leastWorn, notWornRecently });
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

// Get weather-based suggestions without external API
router.get('/weather-suggestions', auth, async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // 🌍 Determine hemisphere (north/south)
    const isNorthernHemisphere = parseFloat(lat) >= 0;

    // 📅 Get current month (0 = Jan ... 11 = Dec)
    const month = new Date().getMonth();

    let season = '';

    if (isNorthernHemisphere) {
      if ([11, 0, 1].includes(month)) season = 'winter';
      else if ([2, 3, 4].includes(month)) season = 'spring';
      else if ([5, 6, 7].includes(month)) season = 'summer';
      else if ([8, 9, 10].includes(month)) season = 'fall';
    } else {
      // Opposite for southern hemisphere
      if ([11, 0, 1].includes(month)) season = 'summer';
      else if ([2, 3, 4].includes(month)) season = 'fall';
      else if ([5, 6, 7].includes(month)) season = 'winter';
      else if ([8, 9, 10].includes(month)) season = 'spring';
    }

    // 🎽 Fetch clothes for that season
    const clothes = await Clothing.find({
      user: req.user.userId,
      season: { $in: [season, 'all'] },
      condition: { $nin: ['donated', 'sold', 'archived'] },
    });

    res.json({ season, clothes });
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch weather suggestions', error: error.message });
  }
});



// Get single clothing item by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const clothing = await Clothing.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!clothing) {
      return res.status(404).json({ message: 'Clothing not found' });
    }

    res.json(clothing);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch clothing', error: error.message });
  }
});


export default router;


