import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../../db.js';
import Product from '../models/Product.js';
import Cuisine from '../models/Cuisine.js';

// Every cuisine gets a named rectractable menu_item product per cuisine.
// These are queryable by the admin menu page via
//   GET /api/cuisines/:id/menu  →  Product.find({ cuisine: id, category: 'menu_item' })
const menuItemsByCuisine = {
  'South Indian': [
    { name: 'Masala Dosa', price: 120, vegType: 'Vegetarian', menuCategory: 'breakfast' },
    { name: 'Idli Sambar', price: 80, vegType: 'Vegetarian', menuCategory: 'breakfast' },
    { name: 'Plain Dosa', price: 100, vegType: 'Vegetarian', menuCategory: 'breakfast' },
    { name: 'Medu Vada', price: 70, vegType: 'Vegetarian', menuCategory: 'breakfast' },
  ],
  'North Indian': [
    { name: 'Paneer Butter Masala', price: 180, vegType: 'Vegetarian', menuCategory: 'main' },
    { name: 'Dal Makhani', price: 150, vegType: 'Vegetarian', menuCategory: 'main' },
    { name: 'Butter Naan', price: 50, vegType: 'Vegetarian', menuCategory: 'breads' },
    { name: 'Jeera Rice', price: 90, vegType: 'Vegetarian', menuCategory: 'breads' },
  ],
  'Indo-Chinese': [
    { name: 'Veg Hakka Noodles', price: 130, vegType: 'Vegetarian', menuCategory: 'main' },
    { name: 'Chilli Paneer', price: 160, vegType: 'Vegetarian', menuCategory: 'main' },
    { name: 'Manchow Soup', price: 100, vegType: 'Vegetarian', menuCategory: 'soups' },
    { name: 'Spring Roll', price: 110, vegType: 'Vegetarian', menuCategory: 'starters' },
  ],
  'BBQ & Grills': [
    { name: 'Tandoori Chicken', price: 220, vegType: 'Non-Vegetarian', menuCategory: 'main' },
    { name: 'Fish Tikka', price: 260, vegType: 'Non-Vegetarian', menuCategory: 'main' },
    { name: 'Paneer Tikka', price: 190, vegType: 'Vegetarian', menuCategory: 'main' },
    { name: 'Seekh Kebab', price: 210, vegType: 'Non-Vegetarian', menuCategory: 'main' },
  ],
  'Breakfast': [
    { name: 'Aloo Paratha', price: 80, vegType: 'Vegetarian', menuCategory: 'breakfast' },
    { name: 'Poha', price: 60, vegType: 'Vegetarian', menuCategory: 'breakfast' },
    { name: 'Upma', price: 50, vegType: 'Vegetarian', menuCategory: 'breakfast' },
    { name: 'Puri Bhaji', price: 90, vegType: 'Vegetarian', menuCategory: 'breakfast' },
  ],
  'Sweets & Mithai': [
    { name: 'Gulab Jamun', price: 40, vegType: 'Vegetarian', menuCategory: 'desserts' },
    { name: 'Rasmalai', price: 50, vegType: 'Vegetarian', menuCategory: 'desserts' },
    { name: 'Jalebi', price: 40, vegType: 'Vegetarian', menuCategory: 'desserts' },
    { name: 'Kheer', price: 60, vegType: 'Vegetarian', menuCategory: 'desserts' },
  ],
  'Soups & Beverages': [
    { name: 'Tomato Soup', price: 70, vegType: 'Vegetarian', menuCategory: 'soups' },
    { name: 'Hot & Sour Soup', price: 80, vegType: 'Non-Vegetarian', menuCategory: 'soups' },
    { name: 'Masala Chai', price: 30, vegType: 'Vegetarian', menuCategory: 'soups' },
    { name: 'Cold Coffee', price: 60, vegType: 'Vegetarian', menuCategory: 'soups' },
  ],
  'Starters': [
    { name: 'Paneer Tikka', price: 160, vegType: 'Vegetarian', menuCategory: 'starters' },
    { name: 'Chilli Paneer', price: 180, vegType: 'Vegetarian', menuCategory: 'starters' },
    { name: 'Veg Seekh', price: 140, vegType: 'Vegetarian', menuCategory: 'starters' },
    { name: 'Hara Bhara Kebab', price: 150, vegType: 'Vegetarian', menuCategory: 'starters' },
  ],
  'Breads & Rice': [
    { name: 'Tandoori Roti', price: 20, vegType: 'Vegetarian', menuCategory: 'breads' },
    { name: 'Butter Roti', price: 30, vegType: 'Vegetarian', menuCategory: 'breads' },
    { name: 'Garlic Naan', price: 60, vegType: 'Vegetarian', menuCategory: 'breads' },
    { name: 'Jeera Rice', price: 80, vegType: 'Vegetarian', menuCategory: 'breads' },
  ],
};

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // ── Step 1: Resolve cuisine IDs ─────────────────────────────────────────
    const cuisines = await Cuisine.find();
    const cuisineMap = {};
    for (const c of cuisines) cuisineMap[c.name] = c._id;

    for (const name of Object.keys(menuItemsByCuisine)) {
      if (!cuisineMap[name]) {
        console.log(`  ⚠ Cuisine not found in DB: "${name}" — seeding map so future runs still work`);
      }
    }

    // ── Step 2: Seed menu_items (category = 'menu_item', linked to cuisine) ─
    console.log('\n── Seeding menu items under cuisines ──');
    let upserted = 0;

    for (const [cuisineName, items] of Object.entries(menuItemsByCuisine)) {
      const cuisineId = cuisineMap[cuisineName];
      if (!cuisineId) {
        console.log(`  ⚠ Skipped — no matching cuisine for "${cuisineName}"`);
        continue;
      }
      if (!cuisines.find(c => String(c._id) === String(cuisineId))) {
        console.log(`  ⚠ Skipped — cuisineId "${cuisineId}" not in cucisine document list`);
        continue;
      }
      for (const item of items) {
        await Product.findOneAndUpdate(
          { name: item.name },
          {
            name: item.name,
            price: item.price,
            category: 'menu_item',
            menuCategory: item.menuCategory,
            cuisine: cuisineId,
            description: `Delicious ${cuisineName} dish`,
            image: '',
            vegType: item.vegType,
            inStock: true,
            featured: false,
          },
          { upsert: true }
        );
        console.log(`  ✓ ${item.name} — ${cuisineName} ₹${item.price}`);
        upserted++;
      }
    }

    // ── Step 3: Seed misc products (bhaji / pickle / chutney) — no cuisine ──
    console.log('\n── Seeding bhaji / pickle / chutney items ──');
    upserted += await seedMiscItems(cuisineMap, upserted);

    console.log(`\nDone. Upserted ${upserted} products.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

async function seedMiscItems(cuisineMap, start) {
  const bhajiItems = [
    { name: 'Desi Bundi Laddo', price: 165 },
    { name: 'Gujrati Kachori', price: 155 },
    { name: 'Loose Gol Matthi', price: 169 },
    { name: 'Loose Mitthi Matthi', price: 169 },
    { name: 'Loose Namek Pare', price: 169 },
    { name: 'Masala Pare', price: 179 },
    { name: 'Pithi Kachori', price: 165 },
    { name: 'Sakkar Pare', price: 90 },
    { name: 'Atta Dry Fruit Laddoo', price: 499 },
    { name: 'Atta Panjiri', price: 499 },
    { name: 'Balushai', price: 299 },
    { name: 'Besan Dry Fruit Laddo', price: 499 },
    { name: 'Besan Laddo', price: 299 },
    { name: 'Chhena Murgi', price: 299 },
    { name: 'Desi Ghee Bundi', price: 199 },
    { name: 'Desi Ghee Bundi Ladoo', price: 299 },
    { name: 'Desi Ghee Gujia', price: 399 },
    { name: 'Desi Ghee Patisha', price: 249 },
    { name: 'Dry Fruit Patisha', price: 299 },
    { name: 'Karachi Halwai', price: 299 },
    { name: 'Meva Panjiri', price: 799 },
  ];
  const pickleItems = [
    { name: 'Kathal ka Achaar', price: 349 },
    { name: 'Lal Mirch ka Bharua Achar', price: 399 },
    { name: 'Aam ka Achar', price: 399 },
    { name: 'Hari Bhari Mirchi', price: 399 },
    { name: 'Ginger Garlic Pickle', price: 499 },
    { name: 'Chilli Mix Pickle', price: 399 },
  ];
  const chutneyItems = [
    { name: 'Tomato Chutney', price: 399 },
    { name: 'Mint Peanut Chutney', price: 399 },
    { name: 'Coconut Chutney', price: 399 },
    { name: 'Coriander Coconut Chutney', price: 399 },
    { name: 'Tomato Thokku', price: 399 },
    { name: 'Peanut / Groundnut Chutney', price: 399 },
    { name: 'Moringa Leaves Chutney', price: 499 },
    { name: 'Green Tomato Chutney', price: 499 },
    { name: 'Chana Dal Chutney', price: 499 },
    { name: 'Mint Yogurt Chutney', price: 499 },
    { name: 'Methi Chutney', price: 399 },
    { name: 'Capsicum Peanut Chutney', price: 399 },
    { name: 'Red Bell Pepper Chutney', price: 399 },
    { name: 'Zucchini Chutney', price: 399 },
    { name: 'Walnut Chutney', price: 599 },
    { name: 'Mango Chutney', price: 599 },
    { name: 'Onion Chutney', price: 499 },
  ];

  const items = [
    ...bhajiItems.map(i => ({ ...i, category: 'bhaji', vegType: 'Vegetarian' })),
    ...pickleItems.map(i => ({ ...i, category: 'pickle', vegType: 'Vegetarian' })),
    ...chutneyItems.map(i => ({ ...i, category: 'chutney', vegType: 'Vegetarian' })),
  ];

  let count = 0;
  for (const item of items) {
    await Product.findOneAndUpdate(
      { name: item.name },
      {
        name: item.name,
        price: item.price,
        category: item.category,
        cuisine: null,
        description: '',
        image: '',
        vegType: item.vegType,
        inStock: true,
        featured: false,
      },
      { upsert: true }
    );
    count++;
  }
  return count;
}

seed();
