import express from 'express';
import requireUserAuth from '../middleware/requireUserAuth.js';
import * as ctrl from '../controllers/accountController.js';

const router = express.Router();

// Profile
router.get('/profile', requireUserAuth, ctrl.getProfile);
router.put('/profile', requireUserAuth, ctrl.updateProfile);

// Addresses
router.get('/addresses', requireUserAuth, ctrl.getAddresses);
router.post('/addresses', requireUserAuth, ctrl.addAddress);
router.delete('/addresses/:index', requireUserAuth, ctrl.deleteAddress);

// Orders
router.get('/orders', requireUserAuth, ctrl.getOrders);
router.post('/orders', requireUserAuth, ctrl.createOrder);

// Loyalty
router.get('/loyalty', requireUserAuth, ctrl.getLoyalty);

// Referral
router.get('/referral', requireUserAuth, ctrl.getReferral);

// Payment Methods
router.get('/payments', requireUserAuth, ctrl.getPaymentMethods);
router.post('/payments', requireUserAuth, ctrl.addPaymentMethod);
router.put('/payments/:index', requireUserAuth, ctrl.updatePaymentMethod);
router.delete('/payments/:index', requireUserAuth, ctrl.deletePaymentMethod);

export default router;
