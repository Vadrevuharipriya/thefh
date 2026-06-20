import express from 'express';
import JobWorkerRate from '../models/JobWorkerRate.js';

const router = express.Router();

// ── GET /api/admin/job-worker-rates  (admin)
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status && status !== '') filter.displayStatus = status;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
      ];
    }
    const data = await JobWorkerRate.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch job worker rates' });
  }
});

// ── GET /api/admin/job-worker-rates/:id  (admin)
router.get('/:id', async (req, res) => {
  try {
    const doc = await JobWorkerRate.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Job worker rate not found' });
    res.json(doc);
  } catch {
    res.status(500).json({ error: 'Failed to fetch job worker rate' });
  }
});

// ── PUT /api/admin/job-worker-rates/:id  (admin)
router.put('/:id', async (req, res) => {
  try {
    const updated = await JobWorkerRate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update job worker rate' });
  }
});

// ── DELETE /api/admin/job-worker-rates/:id  (admin)
router.delete('/:id', async (req, res) => {
  try {
    await JobWorkerRate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete job worker rate' });
  }
});

// ── POST /api/admin/job-worker-rates  (admin)
router.post('/', async (req, res) => {
  try {
    const created = await JobWorkerRate.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create job worker rate' });
  }
});

export default router;
