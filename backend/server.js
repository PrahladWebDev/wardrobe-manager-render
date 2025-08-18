import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import clothingRoutes from './routes/clothing.js';
import outfitRoutes from './routes/outfits.js';
import cors from "cors";
import path from "path";



dotenv.config();
const __dirname = path.resolve();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // React frontend URL
  credentials: true, // If you need cookies/auth headers
}));

app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form data

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/clothing', clothingRoutes);
app.use('/api/outfits', outfitRoutes);

// app.get('/', (req, res) => {
//   res.send('Wardrobe Manager API');
// });
// Serve static files from frontend
app.use(express.static(path.join(__dirname, "/frontend/dist")));
// Catch-all route for SPA
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));