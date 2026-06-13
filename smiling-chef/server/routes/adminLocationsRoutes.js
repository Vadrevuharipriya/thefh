import express from 'express';
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation
} from '../controllers/locationsController.js';

const router = express.Router();

// ── GET /api/admin/locations  (admin)
router.get('/', getAllLocations);

// ── POST /api/admin/locations  (admin)
router.post('/', createLocation);

// ── PUT /api/admin/locations/:id  (admin)
router.put('/:id', updateLocation);

// ── DELETE /api/admin/locations/:id  (admin)
router.delete('/:id', deleteLocation);

export default router;
