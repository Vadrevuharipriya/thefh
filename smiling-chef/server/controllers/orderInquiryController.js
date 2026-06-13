import jwt from 'jsonwebtoken';
import OrderInquiry from '../models/OrderInquiry.js';
import Order from '../models/Order.js';
import { sendOrderInquiryNotification } from '../services/whatsappService.js';
import { generateSecureOTP, validateOTP } from '../utils/otpUtils.js';
import generateQuotationPDF from '../services/pdfService.js';
import sendQuotationEmail from '../services/emailService.js';

// ─── LEGACY ORDER INQUIRY ─────────────────────────────────────
export const postOrderInquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      mobile,
      email,
      plateType,
      quantity,
      deliveryDate,
      deliveryAddress,
      address,
      pincode,
      specialInstructions,
      bhajiType,
      deliveryTime,
      productType,
      spicePreference,
      category,
      orderCategory,
      message,
      occasion,
      numberOfPeople,
      eventDate,
      serviceTime,
      plateItems
    } = req.body;

    const resolvedAddress = deliveryAddress || address || '';
    const resolvedSpecialInstructions = message || specialInstructions;
    const resolvedQuantity = quantity ? Number(quantity) : undefined;

    const created = await OrderInquiry.create({
      name,
      mobile: phone || mobile,
      email,
      category: category || orderCategory || 'customized-plate',
      plateType,
      quantity: resolvedQuantity,
      deliveryDate,
      deliveryAddress: resolvedAddress,
      specialInstructions: resolvedSpecialInstructions,
      bhajiType,
      deliveryTime,
      productType,
      spicePreference,
      numberOfPeople,
      eventDate,
      pincode,
      occasion,
      serviceTime,
      plateItems,
      status: 'new'
    });

    console.log('[Backend] POST /api/order-inquiry - Saved as OrderInquiry with category:', category, 'email:', email);

    // Send email with PDF quotation for customized-plate orders
    const isCustomizedPlate = (category || orderCategory) === 'customized-plate';
    console.log('[Email] Checking conditions - category:', category, 'orderCategory:', orderCategory, 'isCustomizedPlate:', isCustomizedPlate, 'hasEmail:', !!email, 'plateItems:', plateItems?.length);

    let pdfBase64 = null;
    if (isCustomizedPlate && plateItems && plateItems.length > 0) {
      const quotationNumber = created._id.toString().slice(-6).toUpperCase();
      const issueDate = new Date().toLocaleDateString('en-IN');

      const items = plateItems || [];
      const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
      const multiplier = numberOfPeople ? Number(numberOfPeople) : 1;
      const adjustedSubtotal = subtotal * multiplier;
      const discount = adjustedSubtotal > 1000 ? 200 : 0;
      const platformFee = 8;
      const gst = Math.round((adjustedSubtotal - discount) * 0.18);
      const totalPayable = adjustedSubtotal - discount + platformFee + gst;

      try {
        const pdfBuffer = await generateQuotationPDF({
          customerInfo: {
            name,
            phone: phone || mobile,
            email,
            location: deliveryAddress || '',
            numberOfPeople: numberOfPeople || '',
            eventDate: eventDate || deliveryDate || '',
            occasion: occasion || ''
          },
          items: items.map(item => ({
            ...item,
            quantity: multiplier > 1 ? item.quantity * multiplier : item.quantity
          })),
          subtotal: adjustedSubtotal,
          gst,
          platformFee,
          discount,
          totalPayable,
          issueDate,
          quotationNumber
        });

        pdfBase64 = pdfBuffer.toString('base64');

        if (email) {
          await sendQuotationEmail({
            to: email,
            customerName: name,
            quotationNumber,
            pdfBuffer
          });
          console.log('[Email] Quotation sent to:', email);
        }
      } catch (emailErr) {
        console.error('[Email] Failed to send quotation:', emailErr.message);
        console.error('[Email] Full error:', emailErr);
      }
    }

    if (phone) {
      console.log('[Backend] Sending WhatsApp inquiry notification to:', phone);
      sendOrderInquiryNotification(phone, created)
        .then(() => console.log('[WhatsApp] Order inquiry notification sent to', phone))
        .catch(err => {
          console.error('[WhatsApp] Order inquiry notification failed - Message:', err.message);
          console.error('[WhatsApp] Order inquiry notification failed - Full Error:', err);
        });
    } else {
      console.warn('[Backend] No mobile provided in order-inquiry, skipping WhatsApp');
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        if (decoded.userId) {
          const itemLabel = message || plateType || bhajiType || productType || category || 'Order';
          const orderNumber = Date.now().toString().slice(-6) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
          await Order.create({
            user: decoded.userId,
            orderNumber,
            items: [{ name: itemLabel, quantity: quantity || 1, price: 0 }],
            total: 0,
            status: 'pending',
            deliveryAddress: deliveryAddress ? {
              label: 'Delivery',
              name: name,
              phone: phone,
              address: deliveryAddress,
              city: '',
              state: '',
              pincode: '',
            } : undefined,
          });
          console.log('[Backend] POST /api/order-inquiry - Also created Order for user:', decoded.userId);
        }
      } catch {
        // Token invalid or expired — skip order linking silently
      }
    }

    res.json({ success: true, inquiry: created, pdfBase64 });
  } catch (err) {
    console.error('[Backend] POST /api/order-inquiry - Error:', err.message);
    console.error('[Backend] POST /api/order-inquiry - Full Error:', err);
    if (err.errors) {
      console.error('[Backend] POST /api/order-inquiry - Validation Errors:', Object.keys(err.errors).map(k => `${k}: ${err.errors[k].message}`));
    }
    res.status(500).json({ error: 'Failed to save order inquiry', details: err.message });
  }
};

// ── UPDATE ORDER INQUIRY STATUS (with OTP generation for food orders) ─────────────────────
export const updateOrderInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`[Backend] UPDATE ORDER ENQUIRY STATUS: ID=${id}, new status=${status}`);

    // Find the order inquiry
    const orderInquiry = await OrderInquiry.findById(id);
    if (!orderInquiry) {
      console.log(`[Backend] OrderInquiry not found with ID: ${id}`);
      return res.status(404).json({ error: 'Order inquiry not found' });
    }

    console.log(`[Backend] Found orderInquiry: ID=${orderInquiry._id}, category=${orderInquiry.category}, current status=${orderInquiry.status}, phone=${orderInquiry.mobile}`);

    const isFoodOrder = ['customized-plate', 'bhaji-orders', 'chutney-pickle'].includes(orderInquiry.category);
    const isStatusChangingToProgress = status === 'in-progress' && orderInquiry.status !== 'in-progress';

    console.log(`[Backend] Checks: isFoodOrder=${isFoodOrder}, isStatusChangingToProgress=${isStatusChangingToProgress}, hasOtpVerified=${orderInquiry.otpVerified}, hasExistingOtp=${!!orderInquiry.deliveryOtp}`);

    // Generate and send OTP when status transitions to in-progress for food orders
    if (isFoodOrder && isStatusChangingToProgress && !orderInquiry.otpVerified) {
      // Only generate new OTP if one doesn't exist already
      if (!orderInquiry.deliveryOtp) {
        const otp = generateSecureOTP();
        orderInquiry.deliveryOtp = otp;
        orderInquiry.otpGeneratedAt = new Date();
        orderInquiry.otpVerified = false;

        console.log(`[Backend] Generated OTP: ${otp} for orderInquiry ${orderInquiry._id}`);

        // Send OTP via WhatsApp Business API
        const phone = orderInquiry.mobile;
        if (phone) {
          console.log(`[Backend] Sending OTP via WhatsApp to: ${phone}`);
          sendOrderInquiryNotification(phone, orderInquiry, otp)
            .then(result => {
              console.log('[WhatsApp] OTP sent successfully to', phone);
            })
            .catch(error => {
              console.error('[WhatsApp] Failed to send OTP to', phone, ':', error.message);
            });
        } else {
          console.warn('[Backend] No phone number found for orderInquiry:', orderInquiry._id, 'Skipping OTP send');
        }
      } else {
        console.log(`[Backend] OrderInquiry ${orderInquiry._id} already has OTP: ${orderInquiry.deliveryOtp}`);
      }
    } else {
      console.log(`[Backend] Skipping OTP generation. Conditions not met: isFoodOrder=${isFoodOrder}, isStatusChangingToProgress=${isStatusChangingToProgress}, !orderInquiry.otpVerified=${!orderInquiry.otpVerified}`);
    }

    // Update status
    orderInquiry.status = status;

    // If status is resolved and OTP was verified, set deliveredAt
    if (status === 'resolved' && orderInquiry.otpVerified && !orderInquiry.deliveredAt) {
      orderInquiry.deliveredAt = new Date();
    }

    const updated = await orderInquiry.save();

    console.log(`[Backend] PUT /api/order-inquiry/${id}/status - Status: ${status}, OTP generated: ${!!orderInquiry.deliveryOtp}`);
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/order-inquiry/:id/status - Error:', err);
    console.error('[Backend] Full error stack:', err.stack);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// ── VERIFY DELIVERY OTP ────────────────────────────────────────────────────────
export const verifyOrderInquiryDeliveryOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    // Find the order inquiry
    const orderInquiry = await OrderInquiry.findById(id);
    if (!orderInquiry) {
      return res.status(404).json({ error: 'Order inquiry not found' });
    }

    // Only allow OTP verification for food order categories
    const isFoodOrder = ['customized-plate', 'bhaji-orders', 'chutney-pickle'].includes(orderInquiry.category);
    if (!isFoodOrder) {
      return res.status(400).json({ error: 'OTP verification not available for this order type' });
    }

    // Check if already verified
    if (orderInquiry.otpVerified) {
      return res.status(400).json({ error: 'Delivery already verified' });
    }

    // Check if OTP exists
    if (!orderInquiry.deliveryOtp) {
      return res.status(400).json({ error: 'No OTP generated. Please contact support.' });
    }

    // Validate OTP
    if (!validateOTP(otp, orderInquiry.deliveryOtp)) {
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }

    // Mark as verified and update status to resolved
    orderInquiry.otpVerified = true;
    orderInquiry.status = 'resolved';
    orderInquiry.deliveredAt = new Date();

    await orderInquiry.save();

    console.log(`[Backend] POST /api/order-inquiry/${id}/verify-delivery - OTP verified successfully`);
    res.json({ 
      success: true, 
      message: 'Delivery verified successfully',
      inquiry: orderInquiry 
    });
  } catch (err) {
    console.error('[Backend] POST /api/order-inquiry/:id/verify-delivery - Error:', err);
    res.status(500).json({ error: 'Failed to verify delivery' });
  }
};

// ── GET QUOTATION PDF ──────────────────────────────────────────────────────────
export const getQuotationPDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the order inquiry
    const orderInquiry = await OrderInquiry.findById(id);
    if (!orderInquiry) {
      return res.status(404).json({ error: 'Order inquiry not found' });
    }

    // Only generate PDF for customized-plate orders with items
    if (orderInquiry.category !== 'customized-plate' || !orderInquiry.plateItems || orderInquiry.plateItems.length === 0) {
      return res.status(400).json({ error: 'No quotation available for this order' });
    }

    const { name, mobile, email, deliveryAddress, numberOfPeople, eventDate, occasion, plateItems } = orderInquiry;
    const quotationNumber = id.toString().slice(-6).toUpperCase();
    const issueDate = new Date().toLocaleDateString('en-IN');

    const items = plateItems || [];
    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const multiplier = numberOfPeople ? Number(numberOfPeople) : 1;
    const adjustedSubtotal = subtotal * multiplier;
    const discount = adjustedSubtotal > 1000 ? 200 : 0;
    const platformFee = 8;
    const gst = Math.round((adjustedSubtotal - discount) * 0.18);
    const totalPayable = adjustedSubtotal - discount + platformFee + gst;

    // Generate PDF
    const pdfBuffer = await generateQuotationPDF({
      customerInfo: {
        name,
        phone: mobile,
        email,
        location: deliveryAddress || '',
        numberOfPeople: numberOfPeople || '',
        eventDate: eventDate || '',
        occasion: occasion || ''
      },
      items: items.map(item => ({
        ...item,
        quantity: multiplier > 1 ? item.quantity * multiplier : item.quantity
      })),
      subtotal: adjustedSubtotal,
      gst,
      platformFee,
      discount,
      totalPayable,
      issueDate,
      quotationNumber
    });

    // Send PDF as binary file
    const buffer = Buffer.from(new Uint8Array(pdfBuffer));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Quotation_${quotationNumber}.pdf"`);
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  } catch (err) {
    console.error('[Backend] GET /api/order-inquiry/:id/quotation - Error:', err);
    res.status(500).json({ error: 'Failed to generate quotation', details: err.message });
  }
};

export const handleUpload = (req, res) => {
  // console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl =
    `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  res.json({ url: imageUrl });
  
};