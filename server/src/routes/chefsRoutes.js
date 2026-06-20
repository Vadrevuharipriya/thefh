import express from 'express';
import Chef from '../models/Chef.js';
import {
  createFirebaseChefById,
  getFirebaseChefById,
  updateFirebaseChefById,
  deleteFirebaseChefById,
  syncChefToFirebase,
  syncFirebaseChefToMongo,
  syncUnlinkedMongoChefsToFirebase,
} from '../controllers/adminFirebaseController.js';

const router = express.Router();

// ── GET /api/chefs  (public)
router.get('/', async (req, res) => {
  const data = await Chef.find().sort({ name: 1 });
  res.json(data);
});

// ── GET /api/admin/chefs  (admin)
router.get('/admin', async (req, res) => {
  try {
    await syncUnlinkedMongoChefsToFirebase();

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
  } catch (err) {
    console.error('Failed to fetch chefs:', err.message || err);
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
      doc = await syncFirebaseChefToMongo(id);
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
    let mongoChef = null;

    try {
      mongoChef = await Chef.findById(id);
    } catch (err) {
      // Ignore invalid ObjectId type and fall back
    }

    if (!mongoChef) {
      mongoChef = await Chef.findOne({ firebaseId: id });
    }

    if (mongoChef) {
      const updatedMongo = await Chef.findByIdAndUpdate(mongoChef._id, req.body, { new: true, runValidators: true });
      try {
        await syncChefToFirebase(updatedMongo, req.body);
      } catch (syncErr) {
        console.error('Failed to sync chef to Firebase:', syncErr.message || syncErr);
        return res.status(500).json({ error: 'Failed to synchronize chef with Firebase' });
      }
      return res.json(updatedMongo);
    }

    const updatedFirebase = await updateFirebaseChefById(id, req.body);
    if (!updatedFirebase) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    const syncedMongo = await syncFirebaseChefToMongo(id, req.body);
    return res.json(syncedMongo || updatedFirebase);
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

    if (result && result.firebaseId) {
      try {
        await deleteFirebaseChefById(result.firebaseId);
      } catch (cleanupErr) {
        console.error('Failed to delete Firebase chef after Mongo delete:', cleanupErr.message || cleanupErr);
      }
      return res.json({ success: true });
    }

    if (!result) {
      result = await Chef.findOneAndDelete({ firebaseId: id });
      if (result && result.firebaseId) {
        try {
          await deleteFirebaseChefById(result.firebaseId);
        } catch (cleanupErr) {
          console.error('Failed to delete Firebase chef after Mongo delete:', cleanupErr.message || cleanupErr);
        }
        return res.json({ success: true });
      }
    }

    if (!result) {
      const firebaseDeleted = await deleteFirebaseChefById(id);
      if (!firebaseDeleted) {
        return res.status(404).json({ error: 'Chef not found' });
      }
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
    const firebaseChef = await createFirebaseChefById(req.body);
    let created = null;

    try {
      created = await Chef.create({
        ...req.body,
        firebaseId: firebaseChef.firebaseId,
      });
      await syncChefToFirebase(created);
    } catch (err) {
      try {
        await deleteFirebaseChefById(firebaseChef.firebaseId);
      } catch (cleanupErr) {
        console.error('Failed to clean up Firebase chef:', cleanupErr.message);
      }
      throw err;
    }

    res.json(created);
  } catch (err) {
    console.error('Failed to create chef:', err.message || err);
    res.status(500).json({ error: 'Failed to create chef' });
  }
});

export default router;
