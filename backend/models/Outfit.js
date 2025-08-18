import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothing' }],
  season: { type: String, enum: ['spring', 'summer', 'fall', 'winter', 'all'], default: 'all' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Outfit', outfitSchema);