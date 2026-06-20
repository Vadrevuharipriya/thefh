export const COMMON_CART_ORDER_CATEGORY = 'common-cart';

const DEFAULT_ORDER_CATEGORY = COMMON_CART_ORDER_CATEGORY;
const LEGACY_CART_ORDER_CATEGORIES = ['customized-plate', 'bhaji-orders', 'chutney-pickle'];

const toStorageKeyPart = (value) =>
  String(value || DEFAULT_ORDER_CATEGORY).replace(/[^a-zA-Z0-9_-]/g, '_');

export const getCartStorageKeys = (orderCategory = DEFAULT_ORDER_CATEGORY) => {
  const keyPart = toStorageKeyPart(orderCategory);

  return {
    plate: `thefh_cart_${keyPart}_plate`,
    items: `thefh_cart_${keyPart}_items`,
  };
};

const readCartValue = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return {};

    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeCartValue = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value || {}));
  } catch (error) {
    console.error('Failed to persist cart:', error);
  }
};

const mergeCartValues = (values) => values.reduce((acc, value) => ({ ...acc, ...value }), {});

export const readCartPlate = (orderCategory) => readCartValue(getCartStorageKeys(orderCategory).plate);
export const readCartItems = (orderCategory) => readCartValue(getCartStorageKeys(orderCategory).items);
export const writeCartPlate = (orderCategory, plate) => writeCartValue(getCartStorageKeys(orderCategory).plate, plate);
export const writeCartItems = (orderCategory, items) => writeCartValue(getCartStorageKeys(orderCategory).items, items);

export const readCommonCartPlate = () => {
  const commonCartPlate = readCartPlate(COMMON_CART_ORDER_CATEGORY);
  if (Object.keys(commonCartPlate).length > 0) return commonCartPlate;

  return mergeCartValues(LEGACY_CART_ORDER_CATEGORIES.map(readCartPlate));
};

export const readCommonCartItems = () => {
  const commonCartItems = readCartItems(COMMON_CART_ORDER_CATEGORY);
  if (Object.keys(commonCartItems).length > 0) return commonCartItems;

  return mergeCartValues(LEGACY_CART_ORDER_CATEGORIES.map(readCartItems));
};

export const clearAllCarts = () => {
  writeCartPlate(COMMON_CART_ORDER_CATEGORY, {});
  writeCartItems(COMMON_CART_ORDER_CATEGORY, {});
  LEGACY_CART_ORDER_CATEGORIES.forEach((category) => {
    writeCartPlate(category, {});
    writeCartItems(category, {});
  });
};
