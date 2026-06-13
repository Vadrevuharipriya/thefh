import Meal from '../models/Meal.js';
import Schedule from '../models/Schedule.js';

// ─── PUBLIC MEALS ──────────────────────────────────────────────
export const getPublicMeals = async (req, res) => {
  try {
    const data = await Meal.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/meals - Error:', err);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
};

export const getMealById = async (req, res) => {
  try {
    const data = await Meal.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Meal not found' });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
};

// ─── ADMIN MEALS ───────────────────────────────────────────────
export const getAdminMealCategories = async (req, res) => {
  try {
    const data = await Meal.find({ isCategory: true }).sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/meals/categories - Error:', err);
    res.status(500).json({ error: 'Failed to fetch category meals' });
  }
};

export const getAdminMeals = async (req, res) => {
  try {
    const data = await Meal.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/meals - Error:', err);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
};

export const createMeal = async (req, res) => {
  try {
    const created = await Meal.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create meal' });
  }
};

export const updateMeal = async (req, res) => {
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
};

export const deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete meal' });
  }
};

// ─── SCHEDULES ───────────────────────────────────────────────
export const getMealSchedules = async (req, res) => {
  try {
    const data = await Schedule.find({ meal: req.params.mealId }).sort({ createdAt: 1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const data = await Schedule.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Schedule not found' });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const created = await Schedule.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

export const updateSchedule = async (req, res) => {
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
};

export const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};
