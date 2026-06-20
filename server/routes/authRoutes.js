import express from 'express';
import {
  adminLogin,
  userSignup,
  userLogin,
  getCurrentUser,
  logout,
  googleAuth,
  googleCallback,
} from '../controllers/authController.js';
import {
  adminLoginValidator,
  userSignupValidator,
  userLoginValidator,
} from './authValidators.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// User signup → POST /api/auth/signup
router.post('/signup', userSignupValidator, validateRequest, userSignup);

// User login → POST /api/auth/login
router.post('/login', userLoginValidator, validateRequest, userLogin);

// Current user → GET /api/auth/me
router.get('/me', getCurrentUser);

// User logout → POST /api/auth/logout
router.post('/logout', logout);

// Google OAuth redirect → GET /api/auth/google
router.get('/google', googleAuth);

// Google OAuth callback → GET /api/auth/google/callback
router.get('/google/callback', googleCallback);

export default router;
