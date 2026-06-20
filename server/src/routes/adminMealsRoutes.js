import express from 'express';
import Meal from '../models/Meal.js';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// ── GET /api/admin/meals/categories ─────────────────────────
router.get('/categories', async (req, res) => {
  try {
    const data = await Meal.find({ isCategory: true }).sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/meals/categories - Error:', err);
    res.status(500).json({ error: 'Failed to fetch category meals' });
  }
});

// ── GET /api/admin/meals ────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const data = await Meal.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/meals - Error:', err);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// ── POST /api/admin/meals ───────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const created = await Meal.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

// ── PUT /api/admin/meals/:id ────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/meals/:id - Updating meal:', req.params.id, req.body);
    const updated = await Meal.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/meals/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update meal', details: err.message });
  }
});

// ── DELETE /api/admin/meals/:id ─────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

// ── POST /api/admin/schedules ───────────────────────────────
router.post('/schedules', async (req, res) => {
  try {
    const created = await Schedule.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// ── PUT /api/admin/schedules/:id ────────────────────────────
router.put('/schedules/:id', async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/schedules/:id - Updating schedule:', req.params.id, req.body);
    const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/schedules/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update schedule', details: err.message });
  }
});

// ── DELETE /api/admin/schedules/:id ─────────────────────────
router.delete('/schedules/:id', async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export default router;
