import express from 'express';
import * as ctrl from '../controllers/testimonialsController.js';

const router = express.Router();

router.get('/', ctrl.getTestimonials);

export default router;
