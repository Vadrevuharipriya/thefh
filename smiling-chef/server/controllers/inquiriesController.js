import Enquiry from '../models/Enquiry.js';
import OrderInquiry from '../models/OrderInquiry.js';

// ─── INQUIRIES BY CATEGORY ───────────────────────────────────
export const getInquiriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    console.log(
      '[Backend] GET /api/inquiries/category/:category - Requested category:',
      category
    );

    const validCategories = [
      'halwai',
      'general',
      'tiffin',
      'venue',
      'customized-plate',
      'bhaji-orders',
      'chutney-pickle'
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid category'
      });
    }

    const query = {};

    switch (category) {
      case 'halwai':
        query.enquiryType = 'halwai-chef-caterers';

        // Exclude order inquiry categories
        query.orderCategory = {
          $nin: [
            'customized-plate',
            'bhaji-orders',
            'chutney-pickle'
          ]
        };
        break;

      case 'general':
        query.enquiryType = 'general';
        break;

      case 'tiffin':
        query.enquiryType = 'tiffin-services';
        break;

      case 'venue':
        query.enquiryType = 'venue';
        break;

      case 'customized-plate':
      case 'bhaji-orders':
      case 'chutney-pickle':
        // Query OrderInquiry model for order categories
        const data = await OrderInquiry.find({ category }).sort({
          createdAt: -1
        });
        return res.json(data);
    }

    const data = await Enquiry.find(query).sort({
      createdAt: -1
    });

    console.log(
      `[Backend] Found ${data.length} inquiries for category ${category}`
    );

    res.json(data);

  } catch (err) {
    console.error(
      '[Backend] GET /api/inquiries/category/:category - Error:',
      err
    );

    res.status(500).json({
      error: 'Failed to fetch inquiries'
    });
  }
};

// ─── INQUIRY COUNTS ───────────────────────────────────────────
export const getInquiryCounts = async (req, res) => {
  try {
    console.log(
      '[Backend] GET /api/inquiries/counts - Fetching inquiry counts'
    );

    const result = {
      halwai: await Enquiry.countDocuments({
        enquiryType: 'halwai-chef-caterers',
        orderCategory: {
          $nin: [
            'customized-plate',
            'bhaji-orders',
            'chutney-pickle'
          ]
        }
      }),

      general: await Enquiry.countDocuments({
        enquiryType: 'general'
      }),

      tiffin: await Enquiry.countDocuments({
        enquiryType: 'tiffin-services'
      }),

      venue: await Enquiry.countDocuments({
        enquiryType: 'venue'
      }),

      customizedPlate: await OrderInquiry.countDocuments({
        category: 'customized-plate'
      }),

      bhajiOrders: await OrderInquiry.countDocuments({
        category: 'bhaji-orders'
      }),

      chutneyPickle: await OrderInquiry.countDocuments({
        category: 'chutney-pickle'
      })
    };

    console.log(
      '[Backend] Inquiry counts:',
      JSON.stringify(result)
    );

    res.json(result);

  } catch (err) {
    console.error(
      '[Backend] GET /api/inquiries/counts - Error:',
      err
    );

    res.status(500).json({
      error: 'Failed to fetch counts'
    });
  }
};