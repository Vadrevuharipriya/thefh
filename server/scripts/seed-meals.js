import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Meal from './models/Meal.js';

// Import menu data
import { menuSections, bhajiItems, pickleItems, chutneyItems } from '../client/src/data/menuData.js';

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Collect all unique meals from menuSections
    const allMeals = new Map();

    // From menu sections
    for (const section of menuSections) {
      for (const item of section.items) {
        allMeals.set(item.id, {
          name: item.name,
          shortDescription: `${section.name} — ${item.category}`,
          displayStatus: 'Approved'
        });
      }
    }

    // From bhajiItems
    for (const item of bhajiItems) {
      allMeals.set(item.id, {
        name: item.name,
        shortDescription: 'Bhaji Item',
        displayStatus: 'Approved'
      });
    }

    // From pickleItems
    for (const item of pickleItems) {
      allMeals.set(item.id, {
        name: item.name,
        shortDescription: 'Pickle Item',
        displayStatus: 'Approved'
      });
    }

    // From chutneyItems
    for (const item of chutneyItems) {
      allMeals.set(item.id, {
        name: item.name,
        shortDescription: 'Chutney Item',
        displayStatus: 'Approved'
      });
    }

    let upserted = 0;
    for (const [id, mealDoc] of allMeals.entries()) {
      await Meal.findOneAndUpdate(
        { name: mealDoc.name },
        mealDoc,
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`  ✓ ${mealDoc.name}`);
      upserted++;
    }

    console.log(`\nDone. Upserted ${upserted} meals.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
