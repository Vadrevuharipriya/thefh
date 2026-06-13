import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Banner from './models/Banner.js';

const defaultBanners = [
  {
    tag: 'Banquet & Venue',
    title: 'Destination',
    titleAccent: 'Venues',
    subtitle: 'Luxurious banquet halls & outdoor venues for weddings, corporate galas & grand celebrations.',
    image: 'https://images.pexels.com/photos/34079355/pexels-photo-34079355.jpeg',
    rating: 4.9,
    reviews: 1012,
    link: '#',
    sortOrder: 0,
    displayStatus: 'Approved'
  },
  {
    tag: 'Halwai at Home',
    title: 'Expert Chefs',
    titleAccent: 'At Your Door',
    subtitle: 'Verified halwais & professional chefs for any occasion — from pooja to full-scale weddings.',
    image: 'https://images.pexels.com/photos/17294714/pexels-photo-17294714.jpeg',
    rating: 4.5,
    reviews: 1440,
    link: '#',
    sortOrder: 1,
    displayStatus: 'Approved'
  },
  {
    tag: 'Catering Services',
    title: 'Authentic',
    titleAccent: 'Indian Cuisine',
    subtitle: 'From North Indian thalis to Continental spreads — curated menus for 15+ occasion types.',
    image: 'https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg',
    rating: 4.9,
    reviews: 1012,
    link: '#',
    sortOrder: 2,
    displayStatus: 'Approved'
  },
  {
    tag: 'Celebrations',
    title: 'Unforgettable',
    titleAccent: 'Celebrations',
    subtitle: 'Birthday parties, anniversaries, house parties — every event deserves a perfect spread.',
    image: 'https://images.pexels.com/photos/30844787/pexels-photo-30844787.jpeg',
    rating: 4.9,
    reviews: 1012,
    link: '#',
    sortOrder: 3,
    displayStatus: 'Approved'
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const count = await Banner.countDocuments();
    if (count > 0) {
      console.log(`  Found ${count} existing banner(s). Skipping seed.`);
      process.exit(0);
    }

    console.log('\n— Seeding banners —');
    let upserted = 0;
    for (const banner of defaultBanners) {
      await Banner.findOneAndUpdate({ sortOrder: banner.sortOrder }, banner, {
        upsert: true,
        new: true
      });
      console.log(`  ✓ B-${banner.sortOrder + 1}: ${banner.tag} — "${banner.title} ${banner.titleAccent}"`);
      upserted++;
    }

    console.log(`\nDone. Upserted ${upserted} banners.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
