const whatsappToken = process.env.WHATSAPP_BUSINESS_ACCESS_TOKEN?.trim();
const whatsappPhoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID?.trim();
const whatsappApiVersion = process.env.WHATSAPP_BUSINESS_API_VERSION || 'v17.0';
const whatsappLogoUrl = process.env.WHATSAPP_BUSINESS_LOGO_URL || 'https://www.thefamoushalwai.com/frontEnd/images/logo.png';

console.log('[WhatsApp Init] Token present:', !!whatsappToken, 'Length:', whatsappToken ? whatsappToken.length : 0);
console.log('[WhatsApp Init] Phone ID:', whatsappPhoneNumberId, 'Length:', whatsappPhoneNumberId ? whatsappPhoneNumberId.length : 0);
console.log('[WhatsApp Init] API Version:', whatsappApiVersion);
console.log('[WhatsApp Init] Logo URL:', whatsappLogoUrl);

function normalizeWhatsAppPhone(toPhone) {
   if (!toPhone) {
     throw new Error('Missing phone number');
   }

   let phone = toPhone.toString().trim();
   console.log('[WhatsApp Normalize] Input phone:', phone);
   phone = phone.replace(/^(whatsapp:)?/i, '');
   phone = phone.replace(/[\s()-]/g, '');

   if (phone.startsWith('+')) {
     phone = phone.slice(1);
   }
   if (phone.startsWith('0')) {
     phone = phone.slice(1);
   }

   if (/^\d{10}$/.test(phone)) {
     phone = `+91${phone}`;
   } else if (/^\d{11,15}$/.test(phone)) {
     phone = `+${phone}`;
   } else {
     throw new Error(`Invalid phone number format: ${toPhone}`);
   }

   console.log('[WhatsApp Normalize] Output phone:', phone);
   return phone;
}

// Export for use in controllers
export { normalizeWhatsAppPhone };

async function sendWhatsAppMessage(toPhone, body) {
   if (!whatsappToken || !whatsappPhoneNumberId) {
     throw new Error('WhatsApp Business API configuration missing. Set WHATSAPP_BUSINESS_ACCESS_TOKEN and WHATSAPP_BUSINESS_PHONE_NUMBER_ID.');
   }

  const to = normalizeWhatsAppPhone(toPhone);
  const url = `https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`;

  console.log('[WhatsApp Message] Sending to:', to, 'Length:', body.length);

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      body,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${whatsappToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  console.log('[WhatsApp Message] Response status:', response.status, 'Body:', JSON.stringify(json));
  if (!response.ok) {
    const errorMessage = json.error?.message || JSON.stringify(json);
    throw new Error(`WhatsApp Business API error: ${errorMessage}`);
  }

  console.log('[WhatsApp Message] Success, SID:', json.messages?.[0]?.id);
  return json;
}

async function sendWhatsAppTemplate(toPhone, templateName, languageCode = 'en_US', components = []) {
  if (!whatsappToken || !whatsappPhoneNumberId) {
    throw new Error('WhatsApp Business API configuration missing. Set WHATSAPP_BUSINESS_ACCESS_TOKEN and WHATSAPP_BUSINESS_PHONE_NUMBER_ID.');
  }

  const to = normalizeWhatsAppPhone(toPhone);
  const url = `https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`;

  console.log('[WhatsApp Template] ====== TEMPLATE SEND START ======');
  console.log('[WhatsApp Template] Sending to:', to);
  console.log('[WhatsApp Template] Template name:', templateName);
  console.log('[WhatsApp Template] Language:', languageCode);
  console.log('[WhatsApp Template] Components:', JSON.stringify(components));

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components,
    },
  };

  console.log('[WhatsApp Template] Full payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${whatsappToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  console.log('[WhatsApp Template] Response status:', response.status);
  console.log('[WhatsApp Template] Response body:', JSON.stringify(json, null, 2));
  
  if (!response.ok) {
    const errorMessage = json.error?.message || JSON.stringify(json);
    console.error('[WhatsApp Template] ERROR - WhatsApp API rejected:', errorMessage);
    throw new Error(`WhatsApp Business API error: ${errorMessage}`);
  }

  console.log('[WhatsApp Template] Success, SID:', json.messages?.[0]?.id);
  console.log('[WhatsApp Template] ====== TEMPLATE SEND END ======');
  return json;
}

async function sendWhatsAppImage(toPhone, imageUrl, caption) {
  if (!whatsappToken || !whatsappPhoneNumberId) {
    throw new Error('WhatsApp Business API configuration missing. Set WHATSAPP_BUSINESS_ACCESS_TOKEN and WHATSAPP_BUSINESS_PHONE_NUMBER_ID.');
  }

  const to = normalizeWhatsAppPhone(toPhone);
  const url = `https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`;

  console.log('[WhatsApp Image] Sending to:', to, 'URL:', imageUrl, 'Caption:', caption);

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'image',
    image: {
      link: imageUrl,
      caption: caption || '',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${whatsappToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  console.log('[WhatsApp Image] Response status:', response.status, 'Body:', JSON.stringify(json));
  if (!response.ok) {
    const errorMessage = json.error?.message || JSON.stringify(json);
    throw new Error(`WhatsApp Business API error: ${errorMessage}`);
  }

  console.log('[WhatsApp Image] Success, SID:', json.messages?.[0]?.id);
  return json;
}

function buildOrderSummary(order) {
  const address = order.deliveryAddress?.address || order.deliveryAddress?.label || 'Delivery address not provided';
  const items = (order.items || [])
    .map((item, index) => `  ${index + 1}. ${item.name} x${item.quantity || 1} - ₹${item.price || 0}`)
    .join('\n');

  return `*Order Summary*\nOrder #: ${order.orderNumber}\nStatus: ${order.status || 'pending'}\n\nItems:\n${items || '  No items listed'}\n\nTotal: ₹${order.total || 0}\nDelivery: ${address}\n\nThank you for ordering with The Famous Halwai!`;
}

function buildOrderInvoiceOtp(enquiry, otp) {
  const summaryLines = [];
  summaryLines.push('*ORDER SUMMARY*');
  summaryLines.push(`Name: ${enquiry.name || 'N/A'}`);
  summaryLines.push(`Mobile No.: ${enquiry.phone || 'N/A'}`);
  if (enquiry.email) summaryLines.push(`Email: ${enquiry.email}`);
  if (enquiry.location) summaryLines.push(`Service Location: ${enquiry.location}`);
  if (enquiry.date) summaryLines.push(`Event Date: ${enquiry.date}`);
  if (enquiry.service) summaryLines.push(`Menu / Service: ${enquiry.service}`);
  if (enquiry.orderCategory) summaryLines.push(`Category: ${enquiry.orderCategory}`);
  if (enquiry.message) summaryLines.push(`Notes: ${enquiry.message}`);
  summaryLines.push('');
  summaryLines.push(`Delivery OTP: ${otp}`);
  summaryLines.push('Please share this OTP with your delivery partner only after delivery.');
  summaryLines.push('');
  summaryLines.push('Thank you for choosing The Famous Halwai.');

  return summaryLines.join('\n');
}

export async function sendOrderNotification(toPhone, order) {
  return sendWhatsAppTemplate(toPhone, 'hello_world');
}

export async function sendOrderInquiryNotification(toPhone, enquiry, otp) {
  if (otp && enquiry) {
    const summaryLines = [];
    summaryLines.push('*ORDER SUMMARY*');
    summaryLines.push(`Name: ${enquiry.name || 'N/A'}`);
    summaryLines.push(`Mobile No.: ${enquiry.mobile || enquiry.phone || 'N/A'}`);
    if (enquiry.email) summaryLines.push(`Email: ${enquiry.email}`);
    if (enquiry.deliveryAddress) summaryLines.push(`Delivery Address: ${enquiry.deliveryAddress}`);
    if (enquiry.specialInstructions) summaryLines.push(`Notes: ${enquiry.specialInstructions}`);
    summaryLines.push('');
    summaryLines.push(`Delivery OTP: ${otp}`);
    summaryLines.push('Please share this OTP with your delivery partner only after delivery.');
    summaryLines.push('');
    summaryLines.push('Thank you for choosing The Famous Halwai.');
    return sendWhatsAppMessage(toPhone, summaryLines.join('\n'));
  }
  return sendWhatsAppTemplate(toPhone, 'hello_world');
}

export async function sendOrderSummaryOtp(toPhone, enquiry, otp) {
    const message = `Hello! Your delivery OTP is: ${otp}`;
    return sendWhatsAppMessage(toPhone, message);
}
