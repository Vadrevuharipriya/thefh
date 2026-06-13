import express from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import upload from '../middleware/uploadMiddleware.js';
import OrderInquiry from '../models/OrderInquiry.js';
import * as ctrl from '../controllers/orderInquiryController.js';

const router = express.Router();

// Public route for order inquiry submission
router.post('/order-inquiry', ctrl.postOrderInquiry);

// Public route - GET quotation PDF
router.get('/order-inquiry/:id/quotation', ctrl.getQuotationPDF);

// Admin routes - DELETE order inquiry
// Note: Client calls /api/order-inquiry/:id (mapped via /api mount in index.js)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await OrderInquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order inquiry' });
  }
});

// Admin route - UPDATE STATUS (with OTP generation for food orders)
router.put('/:id/status', requireAdmin, ctrl.updateOrderInquiryStatus);

// Verify delivery OTP for food orders (public - delivery personnel can verify)
router.post('/:id/verify-delivery', ctrl.verifyOrderInquiryDeliveryOtp);

router.post(
  '/admin/upload',
  requireAdmin,
  upload.single('image'),
  ctrl.handleUpload
);

export default router;