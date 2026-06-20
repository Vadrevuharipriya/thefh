export const QUOTATION_CATEGORIES = ['customized-plate', 'bhaji-orders', 'chutney-pickle'];

export const calculateQuotationTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const discount = subtotal > 1000 ? 200 : 0;
  const platformFee = subtotal > 0 ? 8 : 0;
  const gst = Math.round((subtotal - discount) * 0.18);
  const totalPayable = subtotal - discount + platformFee + gst;

  return {
    subtotal,
    discount,
    platformFee,
    gst,
    totalPayable
  };
};

export const shouldGenerateQuotation = (category, orderInquiry = {}) => {
  if (!QUOTATION_CATEGORIES.includes(category)) return false;
  if (Array.isArray(orderInquiry.plateItems) && orderInquiry.plateItems.length > 0) return true;
  return Boolean(
    orderInquiry.bhajiType ||
    orderInquiry.productType ||
    orderInquiry.plateType ||
    orderInquiry.specialInstructions
  );
};

export const buildQuotationData = (orderInquiry) => {
  const {
    name,
    mobile,
    email,
    deliveryAddress,
    numberOfPeople,
    eventDate,
    occasion,
    plateItems,
    bhajiType,
    productType,
    plateType,
    spicePreference,
    specialInstructions,
    quantity,
    category,
  } = orderInquiry;

  const quotationNumber = orderInquiry._id
    ? orderInquiry._id.toString().slice(-6).toUpperCase()
    : `Q${Date.now().toString().slice(-6)}`;

  const issueDate = new Date().toLocaleDateString('en-IN');

  const rawItems = Array.isArray(plateItems) && plateItems.length > 0
    ? plateItems
    : [{
        name: bhajiType || productType || plateType || specialInstructions || 'Order Request',
        cuisineName: '',
        veg: true,
        price: 0,
        quantity: quantity ? Number(quantity) : 1,
      }];

  const multiplier = numberOfPeople ? Number(numberOfPeople) : 1;
  const items = rawItems.map((item) => ({
    ...item,
    quantity: multiplier > 1 ? (Number(item.quantity) || 1) * multiplier : (Number(item.quantity) || 1),
  }));

  const totals = calculateQuotationTotals(items);

  return {
    customerInfo: {
      name,
      phone: mobile,
      email,
      location: deliveryAddress || '',
      numberOfPeople: numberOfPeople || '',
      eventDate: eventDate || '',
      occasion: occasion || '',
    },
    items,
    ...totals,
    issueDate,
    quotationNumber,
    category,
  };
};
