import express from 'express';
import Meal from '../models/Meal.js';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// ── GET /api/meals ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const data = await Meal.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/meals - Error:', err);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// ── GET /api/meals/:id ──────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const data = await Meal.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Meal not found' });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
});

// ── GET /api/meals/:mealId/schedules ───────────────────────
router.get('/:mealId/schedules', async (req, res) => {
  try {
    const data = await Schedule.find({ meal: req.params.mealId }).sort({ createdAt: 1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

export default router;
