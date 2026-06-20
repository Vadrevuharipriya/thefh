import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Meal from './models/Meal.js';

// The 4 basic meal categories that have schedules
const basicMeals = [
  { name: 'Breakfast',   shortDescription: 'Start having Breakfast from',  isCategory: true },
  { name: 'Lunch',       shortDescription: 'Start having Lunch from',      isCategory: true },
  { name: 'Evening Snacks', shortDescription: 'Start having Evening Snacks from', isCategory: true },
  { name: 'Dinner',      shortDescription: 'Start having Dinner from',     isCategory: true },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Mark all existing meals as non-category (individual items)
    await Meal.updateMany(
      { isCategory: { $ne: true } },
      { isCategory: false }
    );
    console.log('Marked existing meals as non-category (items)');

    let upserted = 0;
    for (const m of basicMeals) {
      await Meal.findOneAndUpdate(
        { name: m.name },
        { ...m, displayStatus: 'Approved' },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`  ✓ ${m.name} (category)`);
      upserted++;
    }

    console.log(`\nDone. Upserted ${upserted} category meals.`);
    console.log('\nAll meals in DB:');
    const all = await Meal.find({}).sort({ name: 1 }).select('name isCategory displayStatus');
    all.forEach(m => console.log(`  ${m.name.padEnd(30)} isCategory: ${m.isCategory}  status: ${m.displayStatus}`));
    console.log(`Total meals: ${all.length}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
