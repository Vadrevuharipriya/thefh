import express from 'express';
import requireAdmin from '../middleware/requireAdmin.js';

const router = express.Router();

// GET /api/schedules/:id  (public, existed in original code under mealsRoutes scope)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Import Schedule here to avoid circular deps
    const { default: Schedule } = await import('../models/Schedule.js');
    const data = await Schedule.findById(id);
    if (!data) return res.status(404).json({ error: 'Schedule not found' });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Admin-only CRUD
const adminRouter = express.Router();
adminRouter.use(requireAdmin);

adminRouter.get('/', async (req, res) => {
  try {
    const { default: Schedule } = await import('../models/Schedule.js');
    const data = await Schedule.find().sort({ createdAt: 1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

adminRouter.post('/', async (req, res) => {
  try {
    const { default: Schedule } = await import('../models/Schedule.js');
    const created = await Schedule.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

adminRouter.put('/:id', async (req, res) => {
  try {
    const { default: Schedule } = await import('../models/Schedule.js');
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

adminRouter.delete('/:id', async (req, res) => {
  try {
    const { default: Schedule } = await import('../models/Schedule.js');
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export { router as baseRoutes, adminRouter };
export default router;
