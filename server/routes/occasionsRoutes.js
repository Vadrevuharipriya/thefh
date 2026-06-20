import express from 'express';
import Occasion from '../models/Occasion.js';

const router = express.Router();

// ── GET /api/occasions  (public)
router.get('/', async (req, res) => {
  try {
    const data = await Occasion.find({ displayStatus: 'Approved' }).sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/occasions - Error:', err);
    res.status(500).json({ error: 'Failed to fetch occasions' });
  }
});

// ── GET /api/occasions/:id  (public)
router.get('/:id', async (req, res) => {
  try {
    const data = await Occasion.findOne({
      _id: req.params.id,
      displayStatus: 'Approved'
    });
    if (!data) return res.status(404).json({ error: 'Occasion not found or not available' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/occasions/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch occasion' });
  }
});

// ── GET /api/admin/occasions  (admin)
router.get('/', async (req, res) => {
  try {
    const data = await Occasion.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/occasions - Error:', err);
    res.status(500).json({ error: 'Failed to fetch occasions' });
  }
});

// ── GET /api/admin/occasions/:id  (admin)
router.get('/:id', async (req, res) => {
  try {
    const data = await Occasion.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Occasion not found' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/occasions/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch occasion' });
  }
});

// ── POST /api/admin/occasions  (admin)
router.post('/', async (req, res) => {
  try {
    console.log('[Backend] POST /api/admin/occasions - Payload:', {
      name: req.body.name,
      pageUrl: req.body.pageUrl,
      startingPrice: req.body.startingPrice,
      pricingEnabled: req.body.pricingEnabled,
      imageLength: req.body.image?.length || 0,
      innerHeaderLength: req.body.innerHeader?.length || 0
    });
    const created = await Occasion.create(req.body);
    res.json(created);
  } catch (err) {
    console.error('[Backend] POST /api/admin/occasions - Error:', err);
    res.status(500).json({ error: 'Failed to create occasion', details: err.message });
  }
});

// ── PUT /api/admin/occasions/:id  (admin)
router.put('/:id', async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/occasions/:id - Update:', req.params.id, req.body);
    const updated = await Occasion.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Occasion not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/occasions/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update occasion', details: err.message });
  }
});

// ── DELETE /api/admin/occasions/:id  (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Occasion.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete occasion' });
  }
});

export default router;
