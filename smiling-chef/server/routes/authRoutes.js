import express from 'express';
import {
  adminLogin,
  userSignup,
  userLogin,
  googleAuth,
  googleCallback,
} from '../controllers/authController.js';

const router = express.Router();

// User signup → POST /api/auth/signup
router.post('/signup', userSignup);

// User login → POST /api/auth/login
router.post('/login', userLogin);

// Google OAuth redirect → GET /api/auth/google
router.get('/google', googleAuth);

// Google OAuth callback → GET /api/auth/google/callback
router.get('/google/callback', googleCallback);

export default router;
