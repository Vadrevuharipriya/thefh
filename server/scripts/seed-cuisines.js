import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Cuisine from './models/Cuisine.js';

// Cuisines from homeData.js with Pexels images
const cuisines = [
  { name: 'South Indian',  shortDescription: 'Dosa, Idli, Sambhar, Rasam & more', image: 'https://images.pexels.com/photos/958545/hot-chili-peppers-dish-peppers-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
  { name: 'North Indian',  shortDescription: 'Dal Makhani, Paneer, Roti, Biryani & more', image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
  { name: 'Indo-Chinese',  shortDescription: 'Manchurian, Hakka Noodles, Fried Rice & more', image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
  { name: 'BBQ & Grills',  shortDescription: 'Live BBQ, Tikki Rolls, Chat & more', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
  { name: 'Breakfast',     shortDescription: 'Upma, Poha, Cheela, Idli, Dosa & more', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
  { name: 'Sweets & Mithai', shortDescription: 'Jalebi, Rasgulla, Halwa, Kheer & more', image: 'https://images.pexels.com/photos/1829725/pexels-photo-1829725.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
  { name: 'Soups & Beverages', shortDescription: 'Tomato Soup, Lassi, Chaas, Juices & more', image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
  { name: 'Starters',      shortDescription: 'Spring Rolls, Pakora, Manchurian & more', image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
  { name: 'Breads & Rice', shortDescription: 'Roti, Naan, Paratha, Biryani, Pulao & more', image: 'https://images.pexels.com/photos/1871168/pexels-photo-1871168.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop' },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    let upserted = 0;
    for (const c of cuisines) {
      await Cuisine.findOneAndUpdate(
        { name: c.name },
        { ...c, displayStatus: 'Approved' },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`  ✓ ${c.name}`);
      upserted++;
    }
    console.log(`\nDone. Upserted: ${upserted}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
