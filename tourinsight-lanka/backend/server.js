import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Destination, Feedback, Booking, Arrival, User } from './models/Schema.js';

dotenv.config();

const app     = express();
const PORT    = process.env.PORT    || 5050;
const mongoURI= process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tourinsight_lanka';
const JWT_SECRET   = process.env.JWT_SECRET   || 'tourinsight_fallback_secret';
const JWT_EXPIRES  = process.env.JWT_EXPIRES_IN || '7d';

app.use(cors());
app.use(express.json());

// ── DB Connection ────────────────────────────────────────────
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('MongoDB connection failed:', err.message));

// ── Auth Middleware ──────────────────────────────────────────
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorised — no token' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ── Helper ───────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role, country: user.country },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

// ════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, country = 'Others' } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ name, email, password: hashed, country });
    const token  = signToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, country: user.country }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, country: user.country }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me  (validate stored token)
app.get('/api/auth/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// ════════════════════════════════════════════════════════════
//  DATA ROUTES
// ════════════════════════════════════════════════════════════

// 1. Destinations
app.get('/api/destinations', async (req, res) => {
  try {
    res.json(await Destination.find({}));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    res.json(await Feedback.find({}).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, country, rating, category, comments } = req.body;

    const positiveWords = ['great','beautiful','clean','nice','friendly','helpful','amazing','love','best','excellent','spectacular','magical','wonderful'];
    const negativeWords = ['bad','slow','crowded','expensive','dirty','rude','unsafe','scam','overpriced','confusing','tough','difficult','poor'];
    const lower = comments.toLowerCase();
    let score = 0;
    positiveWords.forEach(w => { if (lower.includes(w)) score++; });
    negativeWords.forEach(w => { if (lower.includes(w)) score--; });

    const sentiment = score > 0 || rating >= 4 ? 'Positive'
                    : score < 0 || rating <= 2 ? 'Negative'
                    : 'Neutral';

    const saved = await new Feedback({ name, country, rating: Number(rating), category, comments, sentiment }).save();

    if (category === 'Destinations') {
      const match = await Destination.findOne({ name: { $regex: new RegExp(comments.split(' ')[0], 'i') } });
      if (match) {
        const feeds = await Feedback.find({ category: 'Destinations', comments: { $regex: new RegExp(match.name.split(' ')[0], 'i') } });
        const avg = (feeds.reduce((s, f) => s + f.rating, 0) + Number(rating)) / (feeds.length + 1);
        await Destination.findByIdAndUpdate(match._id, { avgRating: Math.round(avg * 10) / 10 });
      }
    }
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// 3. Hotel Occupancy
app.get('/api/analytics/occupancy', async (req, res) => {
  try {
    res.json(await Booking.find({}).sort({ date: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Tourist Arrivals
app.get('/api/analytics/arrivals', async (req, res) => {
  try {
    res.json(await Arrival.find({}).sort({ year: 1, month: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. Summary Metrics  (admin only)
app.get('/api/analytics/summary', protect, adminOnly, async (req, res) => {
  try {
    const arrivals     = await Arrival.find({});
    const occupancies  = await Booking.find({});
    const feedbacks    = await Feedback.find({});

    const totalArrivals  = arrivals.reduce((s, a) => s + a.count, 0);
    const avgOccupancy   = occupancies.length
      ? Math.round((occupancies.reduce((s, o) => s + o.occupancyRate, 0) / occupancies.length) * 10) / 10 : 0;
    const totalRevenue   = occupancies.reduce((s, o) => s + (o.occupancyRate / 100 * o.averageRoomRate * 120 * 30), 0);
    const avgSatisfaction= feedbacks.length
      ? Math.round((feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length) * 10) / 10 : 0;
    const categoryCounts = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({ totalArrivals, avgOccupancy, totalRevenueUSD: Math.round(totalRevenue), avgSatisfaction, categoryCounts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Error Handlers ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, () => console.log(`TourInsight Lanka backend running on port ${PORT}`));
