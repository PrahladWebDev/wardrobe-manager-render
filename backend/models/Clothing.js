import mongoose from 'mongoose';

const clothingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['shirt', 'pants', 'shoes', 'jacket', 'accessory', 'other', 'watch'], required: true },
  color: { type: String, required: true },
  brand: { type: String },
  material: { type: String },
  season: { type: String, enum: ['spring', 'summer', 'fall', 'winter', 'all'], default: 'all' },
  condition: { type: String, enum: ['new', 'good', 'torn', 'donated', 'sold', 'archived'], default: 'new' },
  image: { type: String },
  isFavorite: { type: Boolean, default: false },
  lastWorn: { type: Date },
  wearCount: { type: Number, default: 0 },
  wearHistory: [{ type: Date }], // Add wearHistory as an array of Dates
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Clothing', clothingSchema);
