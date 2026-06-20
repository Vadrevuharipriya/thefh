import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// ── GET /api/services  (public) ─────────────────────────────
router.get('/', async (req, res) => {
  try {
    const data = await Service.find({ displayStatus: 'Approved' }).sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/services - Error:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// ── GET /api/services/:id  (public)
router.get('/:id', async (req, res) => {
  try {
    const data = await Service.findOne({ _id: req.params.id, displayStatus: 'Approved' });
    if (!data) return res.status(404).json({ error: 'Service not found' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/services/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// ── GET /api/admin/services  (admin)
router.get('/admin', async (req, res) => {
  try {
    const data = await Service.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/services - Error:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// ── GET /api/admin/services/:id  (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const data = await Service.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Service not found' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/services/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service', details: err.message });
  }
});

// ── POST /api/admin/services  (admin)
router.post('/admin', async (req, res) => {
  try {
    console.log('[Backend] POST /api/admin/services - Payload:', req.body);
    const created = await Service.create(req.body);
    res.json(created);
  } catch (err) {
    console.error('[Backend] POST /api/admin/services - Error:', err);
    res.status(500).json({ error: 'Failed to create service', details: err.message });
  }
});

// ── PUT /api/admin/services/:id  (admin)
router.put('/admin/:id', async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/services/:id - Update:', req.params.id, req.body);
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/services/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update service', details: err.message });
  }
});

// ── DELETE /api/admin/services/:id  (admin)
router.delete('/admin/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[Backend] DELETE /api/admin/services/:id - Error:', err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
