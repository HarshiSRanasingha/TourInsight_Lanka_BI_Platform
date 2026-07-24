import mongoose from 'mongoose';

// Destination Schema
const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true, enum: ['Beach', 'Cultural', 'Nature', 'Wildlife', 'Adventure'] },
  image: { type: String, required: true },
  popularityScore: { type: Number, default: 0, min: 0, max: 100 },
  avgRating: { type: Number, default: 0, min: 0, max: 5 },
  visitorCount: { type: Number, default: 0 }
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  category: { type: String, required: true, enum: ['Hotels', 'Destinations', 'Transport', 'Safety', 'General'] },
  comments: { type: String, required: true },
  sentiment: { type: String, required: true, enum: ['Positive', 'Neutral', 'Negative'] },
  createdAt: { type: Date, default: Date.now }
});

// Booking / Hotel Occupancy Schema
const bookingSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  region: { type: String, required: true, enum: ['Western', 'Southern', 'Central', 'Northern', 'Eastern'] },
  occupancyRate: { type: Number, required: true, min: 0, max: 100 },
  averageRoomRate: { type: Number, required: true }, // in USD
  date: { type: Date, required: true }
});

// Arrival Schema (Monthly Arrivals breakdown)
const arrivalSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  count: { type: Number, required: true },
  countryOfOrigin: {
    type: Map,
    of: Number,
    required: true
  },
  purposeOfVisit: {
    type: Map,
    of: Number,
    required: true
  }
});

export const Destination = mongoose.model('Destination', destinationSchema);
export const Feedback = mongoose.model('Feedback', feedbackSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
export const Arrival = mongoose.model('Arrival', arrivalSchema);

// User Schema (Authentication)
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  country:   { type: String, default: 'Others' },
  role:      { type: String, enum: ['tourist', 'admin'], default: 'tourist' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
