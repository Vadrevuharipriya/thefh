import express from 'express';
import Chef from '../models/Chef.js';
import { getFirebaseChefById, updateFirebaseChefById, deleteFirebaseChefById } from '../controllers/adminFirebaseController.js';

const router = express.Router();

// ── GET /api/chefs  (public)
router.get('/', async (req, res) => {
  const data = await Chef.find().sort({ name: 1 });
  res.json(data);
});

// ── GET /api/admin/chefs  (admin)
router.get('/admin', async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status && status !== '') filter.displayStatus = status;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { role: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }
    const data = await Chef.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch chefs' });
  }
});

// ── GET /api/admin/chefs/:id  (admin)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let doc = null;

    try {
      doc = await Chef.findById(id);
    } catch (err) {
      // If it's not a valid MongoDB ObjectId, ignore and fall back to firebase lookup
    }

    if (!doc) {
      doc = await Chef.findOne({ firebaseId: id });
    }

    if (!doc) {
      doc = await getFirebaseChefById(id);
    }

    if (!doc) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    res.json(doc);
  } catch (err) {
    console.error('GET /api/admin/chefs/:id error:', err.message);
    res.status(500).json({ error: 'Failed to fetch chef' });
  }
});

// ── PUT /api/admin/chefs/:id  (admin)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let updated = null;

    try {
      updated = await Chef.findByIdAndUpdate(id, req.body, { new: true });
    } catch (err) {
      // Ignore invalid ObjectId type and fall back
    }

    if (!updated) {
      updated = await Chef.findOneAndUpdate({ firebaseId: id }, req.body, { new: true });
    }

    if (!updated) {
      updated = await updateFirebaseChefById(id, req.body);
    }

    if (!updated) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('PUT /api/admin/chefs/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update chef' });
  }
});

// ── DELETE /api/admin/chefs/:id  (admin)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let result = null;

    try {
      result = await Chef.findByIdAndDelete(id);
    } catch (err) {
      // Ignore invalid ObjectId type and fall back to firebase lookup
    }

    if (!result) {
      result = await Chef.findOneAndDelete({ firebaseId: id });
    }

    if (!result) {
      result = await deleteFirebaseChefById(id);
    }

    if (!result) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/chefs/:id error:', err.message);
    res.status(500).json({ error: 'Failed to delete chef' });
  }
});

// ── POST /api/admin/chefs  (admin)
router.post('/', async (req, res) => {
  try {
    const created = await Chef.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create chef' });
  }
});

export default router;
