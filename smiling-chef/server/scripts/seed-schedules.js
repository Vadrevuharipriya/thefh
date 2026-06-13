import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Meal from './models/Meal.js';
import Schedule from './models/Schedule.js';

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find the 4 category meals
    const mealNames = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'];
    const meals = await Meal.find({ name: { $in: mealNames }, isCategory: true });
    if (meals.length !== 4) {
      console.error('Could not find all 4 category meals. Run seed-basic-meals first.');
      process.exit(1);
    }

    const mealMap = {};
    meals.forEach(m => mealMap[m.name] = m._id);

    // Define default schedules for each meal
    const schedules = [
      // Breakfast - 8 AM to 10 AM
      { meal: mealMap['Breakfast'],  scheduleTime: '8 AM',  displayStatus: 'Approved' },
      { meal: mealMap['Breakfast'],  scheduleTime: '9 AM',  displayStatus: 'Approved' },
      { meal: mealMap['Breakfast'],  scheduleTime: '10 AM', displayStatus: 'Approved' },
      // Lunch - 12 PM to 2 PM
      { meal: mealMap['Lunch'],      scheduleTime: '12 PM', displayStatus: 'Approved' },
      { meal: mealMap['Lunch'],      scheduleTime: '1 PM',  displayStatus: 'Approved' },
      { meal: mealMap['Lunch'],      scheduleTime: '2 PM',  displayStatus: 'Approved' },
      // Evening Snacks - 4 PM to 6 PM
      { meal: mealMap['Evening Snacks'], scheduleTime: '4 PM', displayStatus: 'Approved' },
      { meal: mealMap['Evening Snacks'], scheduleTime: '5 PM', displayStatus: 'Approved' },
      { meal: mealMap['Evening Snacks'], scheduleTime: '6 PM', displayStatus: 'Approved' },
      // Dinner - 7 PM to 10 PM
      { meal: mealMap['Dinner'],     scheduleTime: '7 PM',  displayStatus: 'Approved' },
      { meal: mealMap['Dinner'],     scheduleTime: '8 PM',  displayStatus: 'Approved' },
      { meal: mealMap['Dinner'],     scheduleTime: '9 PM',  displayStatus: 'Approved' },
      { meal: mealMap['Dinner'],     scheduleTime: '10 PM', displayStatus: 'Approved' },
    ];

    let created = 0;
    for (const s of schedules) {
      await Schedule.findOneAndUpdate(
        { meal: s.meal, scheduleTime: s.scheduleTime },
        s,
        { upsert: true, new: true }
      );
      console.log(`  ✓ ${s.scheduleTime} for mealId ${s.meal.toString().slice(-6)}`);
      created++;
    }

    console.log(`\nDone. Seeded ${created} schedules.`);
    const total = await Schedule.countDocuments();
    console.log(`Total schedules in DB: ${total}`);

    // Show summary by meal
    for (const meal of meals) {
      const count = await Schedule.countDocuments({ meal: meal._id });
      console.log(`  ${meal.name}: ${count} schedule(s)`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
