import express from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import * as ctrl from '../controllers/inquiriesController.js';

const router = express.Router();

// ── GET /api/inquiries/category/:category
router.get('/category/:category', requireAdmin, ctrl.getInquiriesByCategory);

// Legacy route alias for compatibility
router.get('/inquiries/category/:category', requireAdmin, ctrl.getInquiriesByCategory);

// ── GET /api/inquiries/counts
router.get('/counts', requireAdmin, ctrl.getInquiryCounts);

export default router;
