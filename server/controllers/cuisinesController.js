import Cuisine from '../models/Cuisine.js';
import Product from '../models/Product.js';

// ─── PUBLIC ──────────────────────────────────────────────────
export const getPublicCuisines = async (req, res) => {
  const cuisines = await Cuisine.find().sort({ name: 1 });
  const cuisinesWithCount = await Promise.all(
    cuisines.map(async (c) => {
      const menuCount = await Product.countDocuments({ cuisine: c._id, category: 'menu_item' });
      return { ...c.toObject(), menuCount };
    })
  );
  res.json(cuisinesWithCount);
};

export const getCuisineById = async (req, res) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);
    if (!cuisine) return res.status(404).json({ error: 'Cuisine not found' });
    res.json(cuisine);
  } catch {
    res.status(500).json({ error: 'Failed to fetch cuisine' });
  }
};

export const getCuisineMenu = async (req, res) => {
  try {
    const menuItems = await Product.find({
      cuisine: req.params.id,
      category: 'menu_item'
    }).sort({ name: 1 });
    res.json(menuItems);
  } catch {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

// ─── ADMIN ───────────────────────────────────────────────────
export const createCuisine = async (req, res) => {
  try {
    const created = await Cuisine.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create cuisine' });
  }
};

export const updateCuisine = async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/cuisines/:id - Updating cuisine:', req.params.id, req.body);
    const updated = await Cuisine.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Cuisine not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/cuisines/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update cuisine', details: err.message });
  }
};

export const deleteCuisine = async (req, res) => {
  try {
    await Cuisine.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete cuisine' });
  }
};
