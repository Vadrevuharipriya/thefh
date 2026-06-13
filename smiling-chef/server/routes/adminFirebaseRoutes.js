import express from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import { getFirebaseChefs, getFirebaseChefBookingsById } from '../controllers/adminFirebaseController.js';

const router = express.Router();

// GET /api/admin/firebase/chefs
router.get('/chefs', requireAdmin, getFirebaseChefs);
router.get('/chefs/:id/bookings', requireAdmin, getFirebaseChefBookingsById);

export default router;
