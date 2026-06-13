import express from 'express';
import Banner from '../models/Banner.js';

const router = express.Router();

// ── GET /api/banners  (public)
// Returns only `Approved` banners by default for public mount. Admin mount can request all.
router.get('/', async (req, res) => {
  try {
    const statusParam = req.query.status;
    const isAdminMount = (req.baseUrl || '').includes('/admin');
    const query = {};

    // Enforce Approved for public mount. Admin mount can request all.
    if (!isAdminMount) {
      query.displayStatus = 'Approved';
    } else if (statusParam === 'Approved') {
      query.displayStatus = 'Approved';
    }

    const data = await Banner.find(query).sort({ sortOrder: 1, createdAt: -1 });
    console.log(`[Banners] GET ${req.baseUrl} - adminMount=${isAdminMount} - statusParam=${statusParam} - returned=${data.length}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// ── GET /api/admin/banners  (admin)
router.get('/admin', async (req, res) => {
  const data = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json(data);
});

// ── GET /api/admin/banners/:id  (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const item = await Banner.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Banner not found' });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
});

// Compatibility routes when the router is mounted at `/api/admin/banners`
// ── GET /api/admin/banners/:id  (admin, alt mount)
router.get('/:id', async (req, res) => {
  try {
    const item = await Banner.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Banner not found' });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
});

// ── POST /api/admin/banners  (admin)
router.post('/admin', async (req, res) => {
  try {
    const created = await Banner.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// Compatibility route when the router is mounted at `/api/admin/banners`
// ── POST /api/admin/banners  (admin, alt mount)
router.post('/', async (req, res) => {
  try {
    const created = await Banner.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// ── PUT /api/admin/banners/:id  (admin)
router.put('/admin/:id', async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// Compatibility route when the router is mounted at `/api/admin/banners`
// ── PUT /api/admin/banners/:id  (admin, alt mount)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// ── DELETE /api/admin/banners/:id  (admin)
router.delete('/admin/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

// Compatibility route when the router is mounted at `/api/admin/banners`
// ── DELETE /api/admin/banners/:id  (admin, alt mount)
router.delete('/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

export default router;
