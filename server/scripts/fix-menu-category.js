import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import Product from '../models/Product.js';
import Cuisine from '../models/Cuisine.js';

// Mapping of cuisine names to their default menuCategory for existing items
const cuisineToMenuCategory = {
  'South Indian': 'breakfast',
  'North Indian': 'main', // Default, but we'll handle specifics below
  'Indo-Chinese': 'main', // Default, but we'll handle specifics below
  'BBQ & Grills': 'main',
  'Breakfast': 'breakfast',
  'Sweets & Mithai': 'desserts',
  'Soups & Beverages': 'soups',
  'Starters': 'starters',
  'Breads & Rice': 'breads',
};

// More specific mappings for items that don't follow the cuisine default
const itemNameToMenuCategory = {
  // South Indian - all breakfast (already covered by cuisine default)
  
  // North Indian - breads
  'Butter Naan': 'breads',
  'Jeera Rice': 'breads',
  'Tandoori Roti': 'breads',
  'Garlic Naan': 'breads',
  
  // Indo-Chinese - soups and starters
  'Manchow Soup': 'soups',
  'Hot & Sour Soup': 'soups',
  'Tomato Soup': 'soups',
  'Masala Chai': 'soups',
  'Cold Coffee': 'soups',
  'Spring Roll': 'starters',
  'Veg Spring Roll': 'starters',
  'Chilli Paneer': 'starters', // Note: this appears in both starters and main in seed data
  'Vegetable Manchurian': 'main',
  'Hakka Noodles': 'main',
  'Chowmein': 'main',
  'Vegetable Fried Rice': 'breads',
  
  // BBQ & Grills - all main (already covered by cuisine default)
  
  // Breakfast - all breakfast (already covered by cuisine default)
  
  // Sweets & Mithai - all desserts (already covered by cuisine default)
  
  // Soups & Beverages - all soups (already covered by cuisine default)
  
  // Starters - all starters (already covered by cuisine default)
  
  // Breads & Rice - all breads (already covered by cuisine default)
};

async function fixMenuCategories() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // First, let's see what we're working with
    const totalItems = await Product.countDocuments({ category: 'menu_item' });
    console.log(`Found ${totalItems} menu items to process`);
    
    const itemsWithoutMenuCategory = await Product.countDocuments({ 
      category: 'menu_item',
      menuCategory: { $exists: false }
    });
    console.log(`Found ${itemsWithoutMenuCategory} menu items without menuCategory`);
    
    const itemsWithNullMenuCategory = await Product.countDocuments({ 
      category: 'menu_item',
      menuCategory: null
    });
    console.log(`Found ${itemsWithNullMenuCategory} menu items with null menuCategory`);
    
    // Get all cuisines to create a name->id map
    const cuisines = await Cuisine.find();
    const cuisineMap = {};
    cuisines.forEach(c => {
      cuisineMap[c.name] = c._id;
    });
    
    // Get all menu items
    const menuItems = await Product.find({ category: 'menu_item' });
    console.log(`Retrieved ${menuItems.length} menu items`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const item of menuItems) {
      // Determine the correct menuCategory for this item
      let menuCategory = item.menuCategory; // Start with existing value if any
      
      // If we don't have a menuCategory or it's null/empty, determine it
      if (!menuCategory) {
        // Get the cuisine name
        const cuisine = await Cuisine.findById(item.cuisine);
        if (!cuisine) {
          console.warn(`  ⚠ Skipping item "${item.name}" - cuisine not found`);
          skippedCount++;
          continue;
        }
        
        // Try to get menuCategory from item-specific mapping first
        menuCategory = itemNameToMenuCategory[item.name];
        
        // If not found in item-specific mapping, use cuisine default
        if (!menuCategory) {
          menuCategory = cuisineToMenuCategory[cuisine.name] || 'main'; // fallback to main
        }
        
        console.log(`  🔧 Updating "${item.name}" (${cuisine.name}) -> menuCategory: ${menuCategory}`);
        
        // Update the item
        await Product.findByIdAndUpdate(item._id, { menuCategory });
        updatedCount++;
      }
    }
    
    console.log(`\n✅ Done! Updated ${updatedCount} items, skipped ${skippedCount} items.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixMenuCategories();