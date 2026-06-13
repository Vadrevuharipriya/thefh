import User from '../models/User.js';
import Order from '../models/Order.js';
import OrderInquiry from '../models/OrderInquiry.js';
import Loyalty from '../models/Loyalty.js';
import Referral from '../models/Referral.js';
import { sendOrderNotification } from '../services/whatsappService.js';

// ─── USER ACCOUNT (requiresUserAuth: req.userId set) ──────────
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email phone');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone },
      { new: true }
    ).select('name email phone');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('addresses');
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add address' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.addresses.splice(req.params.index, 1);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

export const getOrders = async (req, res) => {
  try {
    console.log(`[Backend] Fetching orders for userId: ${req.userId}`);
    const user = await User.findById(req.userId).select('email phone');
    console.log(`[Backend] User lookup result: ${user ? 'Found' : 'Not found'}`);
    if (user) {
      console.log(`[Backend] User details: id=${user._id}, email=${user.email}, phone=${user.phone}`);
    } else {
      console.log(`[Backend] No user found for userId: ${req.userId}`);
      // Still proceed to check for inquiries in case of data inconsistency
    }
    
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    console.log(`[Backend] Found ${orders.length} direct orders for user ${req.userId}`);

    // Build inquiry query with flexible phone number matching
    const inquiryQuery = { $or: [] };
    if (user?.email) {
      inquiryQuery.$or.push({ email: user.email });
      console.log(`[Backend] Added email match condition: ${user.email}`);
    }
    if (user?.phone) {
      // Normalize the user's phone for comparison
      const normalizedUserPhone = user.phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
      console.log(`[Backend] User phone normalized to: ${normalizedUserPhone}`);
      
      // Also try common phone number variations for better matching
      const phoneVariations = [
        user.phone, // Original as provided
        user.phone.replace(/\s+/g, ''), // Remove spaces
        user.phone.replace(/[^\d]/g, ''), // Remove non-digits
      ];
      // Add variations with country code assumptions
      const digitsOnly = user.phone.replace(/[^\d]/g, '');
      if (digitsOnly.length === 10) {
        phoneVariations.push(`+91${digitsOnly}`); // Add Indian country code
        phoneVariations.push(`91${digitsOnly}`);  // Add without +
      } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
        phoneVariations.push(digitsOnly); // Already has country code
        phoneVariations.push(`+${digitsOnly}`); // Add +
      }
      
      // Remove duplicates and empty strings, then add each as a mobile match condition
      const uniqueVariations = [...new Set(phoneVariations.filter(v => v && v.length > 0))];
      console.log(`[Backend] Generated phone variations: ${uniqueVariations.join(', ')}`);
      uniqueVariations.forEach(variation => {
        inquiryQuery.$or.push({ mobile: variation });
      });
      console.log(`[Backend] Added ${uniqueVariations.length} mobile match conditions`);
    }

    let inquiryOrders = [];
    if (inquiryQuery.$or.length > 0) {
      console.log(`[Backend] Searching for order inquiries with query:`, JSON.stringify(inquiryQuery));
      const inquiries = await OrderInquiry.find(inquiryQuery).sort({ createdAt: -1 });
      console.log(`[Backend] Found ${inquiries.length} matching order inquiries`);
      
      // Log the first few matches for debugging
      if (inquiries.length > 0) {
        const logCount = Math.min(3, inquiries.length);
        for (let i = 0; i < logCount; i++) {
          const inq = inquiries[i];
          console.log(`[Backend] Inquiry ${i+1}: _id=${inq._id}, mobile=${inq.mobile}, email=${inq.email}, category=${inq.category}`);
        }
        if (inquiries.length > logCount) {
          console.log(`[Backend] ... and ${inquiries.length - logCount} more`);
        }
      }
      
      inquiryOrders = inquiries.map((inq) => ({
        _id: inq._id,
        orderNumber: inq._id.toString().slice(-6).toUpperCase(),
        status: inq.status,
        items: [
          {
            name: inq.productType || inq.plateType || inq.bhajiType || inq.specialInstructions || inq.category || 'Order Inquiry',
            quantity: inq.quantity || 1,
            price: 0
          }
        ],
        total: 0,
        source: 'inquiry',
        category: inq.category,
        plateType: inq.plateType,
        productType: inq.productType,
        bhajiType: inq.bhajiType,
        quantity: inq.quantity,
        deliveryAddress: inq.deliveryAddress,
        specialInstructions: inq.specialInstructions,
        deliveryTime: inq.deliveryTime,
        mobile: inq.mobile,
        email: inq.email,
        createdAt: inq.createdAt
      }));
    }

    const combinedOrders = [...orders, ...inquiryOrders];
    console.log(`[Backend] Returning ${combinedOrders.length} total orders (${orders.length} direct + ${inquiryOrders.length} inquiries)`);
    res.json(combinedOrders);
  } catch (err) {
    console.error('[Backend] Error in getOrders:', err);
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, total, deliveryAddress, paymentMethod, status } = req.body;
    const orderNumber = Date.now().toString().slice(-6) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const order = await Order.create({
      user: req.userId,
      orderNumber,
      items: items || [],
      total: total || 0,
      deliveryAddress,
      paymentMethod,
      status: status || 'pending',
    });

    if (deliveryAddress?.phone) {
      console.log('[Backend] Order created:', order._id, 'Phone in deliveryAddress:', deliveryAddress.phone);
      console.log('[Backend] Attempting to send WhatsApp hello_world template to:', deliveryAddress.phone);
      
      sendOrderNotification(deliveryAddress.phone, order)
        .then(result => {
          console.log('[WhatsApp Order] Template sent successfully. Response:', JSON.stringify(result, null, 2));
        })
        .catch(err => {
          console.error('[WhatsApp Order] Template send failed');
          console.error('[WhatsApp Order] Error message:', err.message);
          console.error('[WhatsApp Order] Full error:', JSON.stringify(err, null, 2));
        });
    } else {
      console.warn('[Backend] No phone in deliveryAddress. Full address:', JSON.stringify(deliveryAddress));
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Failed to create order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getLoyalty = async (req, res) => {
  try {
    let loyalty = await Loyalty.findOne({ user: req.userId });
    if (!loyalty) {
      loyalty = await Loyalty.create({ user: req.userId });
    }
    res.json(loyalty);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loyalty data' });
  }
};

export const getReferral = async (req, res) => {
  try {
    let referral = await Referral.findOne({ user: req.userId });
    if (!referral) {
      referral = await Referral.create({
        user: req.userId,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase()
      });
    }
    res.json(referral);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch referral data' });
  }
};

export const getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('paymentMethods');
    res.json(user.paymentMethods || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
};

export const addPaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.paymentMethods.push(req.body);
    await user.save();
    res.json(user.paymentMethods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add payment method' });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.paymentMethods[req.params.index] = req.body;
    await user.save();
    res.json(user.paymentMethods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment method' });
  }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.paymentMethods.splice(req.params.index, 1);
    await user.save();
    res.json(user.paymentMethods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
};
