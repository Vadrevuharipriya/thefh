import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = express.Router();

const sanitizeProductBody = (body) => {
  const clean = { ...body };

  if (clean.name) clean.name = String(clean.name).trim();
  if (clean.price !== undefined && clean.price !== null && clean.price !== '') {
    clean.price = Number(clean.price);
  } else if (clean.price === '') {
    clean.price = 0;
  }

  if (clean.category) clean.category = String(clean.category).toLowerCase();
  if (clean.description === '') delete clean.description;
  if (clean.image === '') delete clean.image;

  if (clean.menuCategory === '' || clean.menuCategory === null || clean.menuCategory === undefined) {
    delete clean.menuCategory;
  }

  if (clean.cuisine?._id) clean.cuisine = clean.cuisine._id;
  if (
    clean.cuisine === '' ||
    clean.cuisine === null ||
    clean.cuisine === undefined ||
    clean.cuisine === 'undefined' ||
    clean.cuisine === 'null'
  ) {
    delete clean.cuisine;
  }
  if (clean.cuisine && !mongoose.Types.ObjectId.isValid(clean.cuisine)) {
    delete clean.cuisine;
  }

  return clean;
};

// ── GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('cuisine', 'name');
    res.json(products);
  } catch (err) {
    console.error('[Backend] GET /api/products - Error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ── GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('cuisine', 'name');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('[Backend] GET /api/products/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ── POST /api/admin/products
router.post('/', async (req, res) => {
  try {
    const body = sanitizeProductBody(req.body);
    const created = await Product.create(body);
    res.json(created);
  } catch (err) {
    console.error('[Backend] POST /api/admin/products - Error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: Object.keys(err.errors).map(k => `${k}: ${err.errors[k].message}`).join(', ') });
    }
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
});

// ── PUT /api/admin/products/:id
router.put('/:id', async (req, res) => {
  try {
    const body = sanitizeProductBody(req.body);
    const updated = await Product.findByIdAndUpdate(req.params.id, body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/products/:id - Error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: Object.keys(err.errors).map(k => `${k}: ${err.errors[k].message}`).join(', ') });
    }
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// ── DELETE /api/admin/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[Backend] DELETE /api/admin/products/:id - Error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
