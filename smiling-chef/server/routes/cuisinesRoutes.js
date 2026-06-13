import express from 'express';
import Cuisine from '../models/Cuisine.js';
import Product from '../models/Product.js';

const router = express.Router();

// ── GET /api/cuisines  (public)
router.get('/', async (req, res) => {
  const cuisines = await Cuisine.find().sort({ name: 1 });
  const cuisinesWithCount = await Promise.all(
    cuisines.map(async (c) => {
      const menuCount = await Product.countDocuments({ cuisine: c._id, category: 'menu_item' });
      return { ...c.toObject(), menuCount };
    })
  );
  res.json(cuisinesWithCount);
});

// ── GET /api/admin/cuisines  (admin)
router.get('/', async (req, res) => {
  try {
    const cuisines = await Cuisine.find().sort({ name: 1 });
    const cuisinesWithCount = await Promise.all(
      cuisines.map(async (c) => {
        const menuCount = await Product.countDocuments({ cuisine: c._id, category: 'menu_item' });
        return { ...c.toObject(), menuCount };
      })
    );
    res.json(cuisinesWithCount);
  } catch (err) {
    console.error('[Backend] GET /api/admin/cuisines - Error:', err);
    res.status(500).json({ error: 'Failed to fetch cuisines', details: err.message });
  }
});

// ── GET /api/admin/cuisines/:id  (admin)
router.get('/:id', async (req, res) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);
    if (!cuisine) return res.status(404).json({ error: 'Cuisine not found' });
    res.json(cuisine);
  } catch (err) {
    console.error('[Backend] GET /api/admin/cuisines/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch cuisine', details: err.message });
  }
});

// ── GET /api/cuisines/:id  (public)
router.get('/:id', async (req, res) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);
    if (!cuisine) return res.status(404).json({ error: 'Cuisine not found' });
    res.json(cuisine);
  } catch {
    res.status(500).json({ error: 'Failed to fetch cuisine' });
  }
});

// ── GET /api/cuisines/:id/menu  (public)
router.get('/:id/menu', async (req, res) => {
  try {
    const menuItems = await Product.find({
      cuisine: req.params.id,
      category: 'menu_item'
    }).sort({ name: 1 });
    res.json(menuItems);
  } catch {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// ── POST /api/admin/cuisines  (admin)
router.post('/', async (req, res) => {
  try {
    const created = await Cuisine.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create cuisine' });
  }
});

// ── PUT /api/admin/cuisines/:id  (admin)
router.put('/:id', async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/cuisines/:id - Updating cuisine:', req.params.id, req.body);
    const updated = await Cuisine.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Cuisine not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/cuisines/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update cuisine', details: err.message });
  }
});

// ── DELETE /api/admin/cuisines/:id  (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Cuisine.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete cuisine' });
  }
});

export default router;
