import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';

import authRoutes from './routes/authRoutes.js';
import { adminLogin } from './controllers/authController.js';
import servicesRoutes from './routes/servicesRoutes.js';
import occasionsRoutes from './routes/occasionsRoutes.js';
import mealsRoutes from './routes/mealsRoutes.js';
import blogsRoutes from './routes/blogsRoutes.js';
import adminBlogsRoutes from './routes/adminBlogsRoutes.js';
import testimonialsRoutes from './routes/testimonialsRoutes.js';
import cuisinesRoutes from './routes/cuisinesRoutes.js';
import bannersRoutes from './routes/bannersRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import chefsRoutes from './routes/chefsRoutes.js';
import jobWorkerRatesRoutes from './routes/jobWorkerRatesRoutes.js';
import locationsRoutes from './routes/locationsRoutes.js';
import adminLocationsRoutes from './routes/adminLocationsRoutes.js';
import referralCodesRoutes from './routes/referralCodesRoutes.js';
import orderInquiryRoutes from './routes/orderInquiryRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import inquiriesRoutes from './routes/inquiriesRoutes.js';
import panelUsersRoutes from './routes/panelUsersRoutes.js';
import adminMealsRoutes from './routes/adminMealsRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import websitePagesRoutes from './routes/websitePagesRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminFirebaseRoutes from './routes/adminFirebaseRoutes.js';

// ─── APP INIT ───────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

  // ─── MIDDLEWARE ─────────────────────────────────────────────
  app.use(cors());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));
  

// ─── CONNECT DB ─────────────────────────────────────────────
await connectDB();

// ─── ROOT ROUTE ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('The Famous Halwai API is running 🚀');
});

// ─── HEALTH ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── ADMIN LOGIN ─────────────────────────────────────────────
app.post('/api/admin/login', adminLogin);

// ─── MOUNT ROUTES ───────────────────────────────────────────

// Public routes mounted at /api/*
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/occasions', occasionsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/cuisines', cuisinesRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/chefs', chefsRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/website-pages', websitePagesRoutes);
app.use('/api/admin', uploadRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api', orderInquiryRoutes);

// Account
app.use('/api/account', accountRoutes);

// Admin sub-routes
app.use('/api/admin/products', productsRoutes);
app.use('/api/admin/services', servicesRoutes);
app.use('/api/admin/occasions', occasionsRoutes);
app.use('/api/admin/meals', adminMealsRoutes);
app.use('/api/admin/blogs', adminBlogsRoutes);
app.use('/api/admin/cuisines', cuisinesRoutes);
app.use('/api/admin/banners', bannersRoutes);
app.use('/api/admin/events', eventsRoutes);
app.use('/api/admin/chefs', chefsRoutes);
app.use('/api/admin/job-worker-rates', jobWorkerRatesRoutes);
app.use('/api/admin/locations', adminLocationsRoutes);
app.use('/api/admin/referral-codes', referralCodesRoutes);
app.use('/api/admin/panel-users', panelUsersRoutes);
app.use('/api/admin/website-pages', websitePagesRoutes);

// Firebase-backed admin endpoints
app.use('/api/admin/firebase', adminFirebaseRoutes);

// ─── SERVER START ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
