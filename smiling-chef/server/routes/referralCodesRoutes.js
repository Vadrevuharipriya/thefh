import express from 'express';
import Referral from '../models/Referral.js';

const router = express.Router();

// ── GET /api/admin/referral-codes  (admin)
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status && status !== '') filter.displayStatus = status;
    if (search) {
      filter.$or = [
        { user: new RegExp(search, 'i') },
        { referralCode: new RegExp(search, 'i') },
      ];
    }
    const data = await Referral.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch referral codes' });
  }
});

// ── GET /api/admin/referral-codes/:id  (admin)
router.get('/:id', async (req, res) => {
  try {
    const doc = await Referral.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Referral code not found' });
    res.json(doc);
  } catch {
    res.status(500).json({ error: 'Failed to fetch referral code' });
  }
});

// ── PUT /api/admin/referral-codes/:id  (admin)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Referral.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update referral code' });
  }
});

// ── DELETE /api/admin/referral-codes/:id  (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Referral.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete referral code' });
  }
});

// ── POST /api/admin/referral-codes  (admin)
router.post('/', async (req, res) => {
  try {
    const created = await Referral.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create referral code' });
  }
});

export default router;
