import express from 'express';
import auth from '../middleware/auth.js';
import Outfit from '../models/Outfit.js';
import Clothing from '../models/Clothing.js';

const router = express.Router();

// Create outfit
router.post('/', auth, async (req, res) => {
  try {
    const { name, items, season } = req.body;
    const outfit = new Outfit({ name, items, season, user: req.user.userId });
    await outfit.save();
    res.status(201).json(outfit);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create outfit', error: error.message });
  }
});

// Get all outfits
router.get('/', auth, async (req, res) => {
  try {
    const outfits = await Outfit.find({ user: req.user.userId }).populate('items');
    res.json(outfits);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch outfits', error: error.message });
  }
});

// Get random outfit
router.get('/random', auth, async (req, res) => {
  try {
    const outfits = await Outfit.find({ user: req.user.userId }).populate('items');
    if (outfits.length === 0) return res.json({ message: 'No outfits found' });
    const randomOutfit = outfits[Math.floor(Math.random() * outfits.length)];
    res.json(randomOutfit);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch random outfit', error: error.message });
  }
});

// Update outfit
router.put('/:id', auth, async (req, res) => {
  try {
    const outfit = await Outfit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    ).populate('items');
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });
    res.json(outfit);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update outfit', error: error.message });
  }
});

// Delete outfit
router.delete('/:id', auth, async (req, res) => {
  try {
    const outfit = await Outfit.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });
    res.json({ message: 'Outfit deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete outfit', error: error.message });
  }
});

// Get single outfit by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const outfit = await Outfit.findOne({ _id: req.params.id, user: req.user.userId })
      .populate('items');
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });
    res.json(outfit);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch outfit', error: error.message });
  }
});


export default router;