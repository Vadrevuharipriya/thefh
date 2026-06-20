import Enquiry from '../models/Enquiry.js';
import Order from '../models/Order.js';
import { getTokenFromRequest, verifyJwtToken } from '../utils/auth.js';
import { generateSecureOTP, validateOTP } from '../utils/otpUtils.js';
// import { sendOrderSummaryOtp, sendOrderNotification, normalizeWhatsAppPhone } from '../services/whatsappService.js';

// ─── PUBLIC ──────────────────────────────────────────────────
export const submitEnquiry = async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      service, 
      location, 
      date, 
      message, 
      enquiryType, 
      orderCategory,
      numberOfPeople,
      eventDate,
      pincode,
      occasion,
      serviceTime,
      plateItems
    } = req.body;

    let detectedOrderCategory = orderCategory || '';
    if (!detectedOrderCategory && service) {
      const svc = service.toLowerCase();
      if (svc.includes('bhaji') || svc.includes('bund') || svc.includes('gujrati') || svc.includes('gol') || svc.includes('balushai') || svc.includes('karachi') || svc.includes('meva')) {
        detectedOrderCategory = 'bhaji-orders';
      } else if (svc.includes('cha') || svc.includes('thokku') || svc.includes('chut') || svc.includes('achar') || svc.includes('mirch') || svc.includes('pickle') || svc.includes('ginger') || svc.includes('mango')) {
        detectedOrderCategory = 'chutney-pickle';
      } else if (svc.includes('plate') || svc.includes('custom') || svc.includes('p') || svc.includes('catering')) {
        detectedOrderCategory = 'customized-plate';
      }
    }

    let detectedEnquiryType = enquiryType || 'general';
    if (detectedOrderCategory && detectedEnquiryType === 'general') {
      detectedEnquiryType = 'halwai-chef-caterers';
    }

    const created = await Enquiry.create({
      name,
      phone,
      email,
      service: service || '',
      location: location || '',
      date: date || '',
      message: message || '',
      enquiryType: detectedEnquiryType,
      orderCategory: detectedOrderCategory,
      numberOfPeople,
      eventDate,
      pincode,
      occasion,
      serviceTime,
      status: 'new'
    });
    console.log('[Backend] POST /api/enquiry - Created enquiry:', created._id, 'orderCategory:', detectedOrderCategory, 'enquiryType:', detectedEnquiryType);

    const token = getTokenFromRequest(req);
    if (token) {
      try {
        const decoded = verifyJwtToken(token);
        if (decoded.userId) {
          const orderNumber = Date.now().toString().slice(-6) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
          await Order.create({
            user: decoded.userId,
            orderNumber,
            items: [{ name: service || detectedOrderCategory || 'Service Booking', quantity: 1, price: 0 }],
            total: 0,
            status: 'pending',
            deliveryAddress: (location || name) ? {
              label: 'Event',
              name: name,
              phone: phone,
              address: location || '',
              city: '',
              state: '',
              pincode: '',
            } : undefined,
          });
          console.log('[Backend] POST /api/enquiry - Also created Order for user:', decoded.userId);
        }
      } catch {
        // Token invalid or expired — skip order linking silently
      }
    }

    res.json({ success: true, enquiry: created });
  } catch (err) {
    console.error('[Backend] POST /api/enquiry - Error:', err);
    res.status(500).json({ error: 'Failed to save enquiry' });
  }
};

// ─── ENQUIRIES LIST ───────────────────────────────────────────────
export const getEnquiries = async (req, res) => {
  try {
    const data = await Enquiry.find().sort({ createdAt: -1 });
    console.log('[Backend] GET /api/enquiries - Found', data.length, 'enquiries');
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/enquiries - Error:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

// ── UPDATE ENQUIRY STATUS (with OTP generation for halwai-chef-caterers inquiries) ───────────────
export const updateEnquiryStatus = async (req, res) => {
   try {
     const { id } = req.params;
     const { status } = req.body;
     
     console.log(`[Backend] UPDATE ENQUIRY STATUS: ID=${id}, new status=${status}`);

     // Find the enquiry
     const enquiry = await Enquiry.findById(id);
     if (!enquiry) {
       console.log(`[Backend] Enquiry not found with ID: ${id}`);
       return res.status(404).json({ error: 'Enquiry not found' });
     }

     // Only halwai-chef-caterers enquiries (not order categories like customized-plate) go through here
     console.log(`[Backend] Found enquiry: ID=${enquiry._id}, enquiryType=${enquiry.enquiryType}, current status=${enquiry.status}, phone=${enquiry.phone || enquiry.mobile}`);

     // Update status
     enquiry.status = status;

     const updated = await enquiry.save();

     console.log(`[Backend] PUT /api/enquiries/${id}/status - Status: ${status}`);
     res.json(updated);
   } catch (err) {
     console.error('[Backend] PUT /api/enquiries/:id/status - Error:', err);
     console.error('[Backend] Full error stack:', err.stack);
     res.status(500).json({ error: 'Failed to update status' });
   }
 };

// ── VERIFY DELIVERY OTP ─────────────────────────────────────────────────────
export const verifyDeliveryOtp = async (req, res) => {
   try {
     const { id } = req.params;
     const { otp } = req.body;

     // Find the enquiry
     const enquiry = await Enquiry.findById(id);
     if (!enquiry) {
       return res.status(404).json({ error: 'Enquiry not found' });
     }

     // Check if already verified
     if (enquiry.otpVerified) {
       return res.status(400).json({ error: 'Delivery already verified' });
     }

     // Check if OTP exists
     if (!enquiry.deliveryOtp) {
       return res.status(400).json({ error: 'No OTP generated. Please contact support.' });
     }

     // Validate OTP
     if (!validateOTP(otp, enquiry.deliveryOtp)) {
       return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
     }

     // Mark as verified and update status to resolved
     enquiry.otpVerified = true;
     enquiry.status = 'resolved';
     enquiry.deliveredAt = new Date();

     await enquiry.save();

     console.log(`[Backend] POST /api/enquiries/${id}/verify-delivery - OTP verified successfully`);
     res.json({ 
       success: true, 
       message: 'Delivery verified successfully',
       enquiry: enquiry 
     });
   } catch (err) {
     console.error('[Backend] POST /api/enquiries/:id/verify-delivery - Error:', err);
     res.status(500).json({ error: 'Failed to verify delivery' });
   }
 };