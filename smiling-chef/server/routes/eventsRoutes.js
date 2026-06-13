import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// ── GET /api/events  (public – Approved only)
router.get('/', async (req, res) => {
  const data = await Event.find({ displayStatus: 'Approved' }).sort({ displayOrder: 1 });
  res.json(data);
});

// ── GET /api/admin/events  (admin – all events)
router.get('/admin', async (req, res) => {
  const data = await Event.find().sort({ displayOrder: 1 });
  res.json(data);
});

// ── GET /api/admin/events/:id  (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const item = await Event.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Event not found' });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// ── POST /api/admin/events  (admin)
router.post('/admin', async (req, res) => {
  try {
    const { name, slug, image, date, description, displayStatus, displayOrder } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });
    const created = await Event.create({
      name,
      slug,
      image: image || '',
      date: date || '',
      description: description || '',
      displayStatus: displayStatus || 'Pending',
      displayOrder: displayOrder ?? 0,
    });
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// ── PUT /api/admin/events/:id  (admin)
router.put('/admin/:id', async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/events/:id -', req.params.id, req.body);
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] Error updating event:', err);
    res.status(500).json({ error: 'Failed to update event', details: err.message });
  }
});

// ── PUT /api/admin/events/reorder  (admin)
router.put('/admin/reorder', async (req, res) => {
  try {
    const { order } = req.body;
    for (const item of order) {
      await Event.findByIdAndUpdate(item._id, { displayOrder: item.displayOrder });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder events' });
  }
});

// ── DELETE /api/admin/events/:id  (admin)
router.delete('/admin/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
