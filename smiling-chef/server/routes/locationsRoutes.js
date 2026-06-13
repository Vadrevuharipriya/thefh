import express from 'express';
import Location from '../models/Location.js';

const router = express.Router();

// ── GET /api/locations  (public – Approved only)
router.get('/', async (req, res) => {
  try {
    const data = await Location.find({ displayStatus: 'Approved' }).sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/locations - Error:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

export default router;
