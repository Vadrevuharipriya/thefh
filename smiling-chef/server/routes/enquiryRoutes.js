import express from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import Enquiry from '../models/Enquiry.js';
import * as ctrl from '../controllers/enquiryController.js';

const router = express.Router();

// ── POST /api/enquiry
router.post('/enquiry', ctrl.submitEnquiry);

// ── GET /api/enquiries
router.get('/enquiries', ctrl.getEnquiries);

// ── DELETE /api/admin/enquiries/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// UPDATE STATUS (with OTP generation for food orders)
router.put('/:id/status', requireAdmin, ctrl.updateEnquiryStatus);

// ── Verify delivery OTP for food orders (public - delivery personnel can verify)
router.post('/:id/verify-delivery', ctrl.verifyDeliveryOtp);

export default router;
