import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Chef from './models/Chef.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Embedded professionals data (from professionalsData.js)
const professionals = [
  {
    id: 1,
    slug: 'om-prakash',
    name: 'Om Prakash',
    role: 'Master Halwai',
    city: 'Noida',
    experience: 10,
    rating: 4.3,
    events: 120,
    followers: 45,
    image: 'om_prakash.jpg',
    bio: 'Om Prakash is a professional Chef with knowledge and experience of Chinese, North Indian, Italian, Continental, Barbecue, Ghar ka Khaana, Beverages, Desserts, Soups, Salads, Thai, Snacks, American, Mexican, Breakfast, Navratri, South Indian. He lives in Greater Noida and has 10 years of experience working in kitchens, cafes, restaurants and hotels.',
    awards: [
      { label: 'Tandoor Specialist', icon: 'flame' },
      { label: 'Punctual Person', icon: 'clock' },
      { label: 'Very Polite', icon: 'heart' },
      { label: 'Speedy Service', icon: 'zap' },
    ],
    serviceTypes: ['Personal Chef', 'Catering', 'Full Time Chef', 'Vacation Chef', 'Daily Chef', 'Cooking Classes'],
    cuisines: ['North Indian', 'South Indian', 'Chinese', 'Continental', 'Barbecue', 'Navratri', 'Breakfast'],
    ratingBreakdown: { 5: 204, 4: 45, 3: 20, 2: 8, 1: 5 },
    totalRatings: 282,
  },
  {
    id: 2,
    slug: 'pankaj-kumar',
    name: 'Pankaj Kumar',
    role: 'Executive Chef',
    city: 'Delhi NCR',
    experience: 5,
    rating: 5.0,
    events: 250,
    followers: 112,
    image: 'pankaj_kumar.jpg',
    bio: 'Pankaj Kumar is an Executive Chef with over 5 years of expertise in delivering exceptional culinary experiences. Specialising in North Indian cuisine and event catering, he has worked at top hotels and restaurants across Delhi NCR, bringing authentic flavours and impeccable presentation to every occasion.',
    awards: [
      { label: 'Top Rated Chef', icon: 'star' },
      { label: 'Punctual Person', icon: 'clock' },
      { label: 'Very Polite', icon: 'heart' },
      { label: 'Speedy Service', icon: 'zap' },
    ],
    serviceTypes: ['Personal Chef', 'Catering', 'Full Time Chef', 'Daily Chef', 'Cooking Classes'],
    cuisines: ['North Indian', 'Mughlai', 'Continental', 'Breakfast', 'Sweets & Mithai'],
    ratingBreakdown: { 5: 240, 4: 8, 3: 2, 2: 0, 1: 0 },
    totalRatings: 250,
  },
  {
    id: 3,
    slug: 'pankaj-garola',
    name: 'Pankaj Garola',
    role: 'Senior Chef',
    city: 'Dehradun',
    experience: 9,
    rating: 4.9,
    events: 180,
    followers: 78,
    image: 'pankaj_garola.jpg',
    bio: 'Pankaj Garola is a Senior Chef from Dehradun with 9 years of hands-on experience across diverse Indian and international cuisines. Known for his dedication and consistent quality, he specialises in large-scale catering for weddings, corporate events and festive gatherings.',
    awards: [
      { label: 'Tandoor Specialist', icon: 'flame' },
      { label: 'Punctual Person', icon: 'clock' },
      { label: 'Very Polite', icon: 'heart' },
      { label: 'Speedy Service', icon: 'zap' },
    ],
    serviceTypes: ['Personal Chef', 'Catering', 'Full Time Chef', 'Vacation Chef', 'Daily Chef'],
    cuisines: ['North Indian', 'South Indian', 'BBQ & Grills', 'Starters', 'Breads & Rice'],
    ratingBreakdown: { 5: 165, 4: 12, 3: 2, 2: 1, 1: 0 },
    totalRatings: 180,
  },
  {
    id: 4,
    slug: 'shanker-kothiyal',
    name: 'Shanker Kothiyal',
    role: 'Halwai Expert',
    city: 'Haridwar',
    experience: 11,
    rating: 4.5,
    events: 310,
    followers: 134,
    image: 'shanker_kothiyal.jpg',
    bio: 'Shanker Kothiyal is a seasoned Halwai Expert with 11 years of experience rooted in traditional Indian sweet-making and festive cooking. Based in Haridwar, he brings authentic Garhwali and North Indian flavours to every event, making him a preferred choice for poojas, weddings and community feasts.',
    awards: [
      { label: 'Sweets Expert', icon: 'star' },
      { label: 'Punctual Person', icon: 'clock' },
      { label: 'Very Polite', icon: 'heart' },
      { label: 'Speedy Service', icon: 'zap' },
    ],
    serviceTypes: ['Personal Chef', 'Catering', 'Full Time Chef', 'Vacation Chef', 'Daily Chef', 'Cooking Classes'],
    cuisines: ['North Indian', 'Sweets & Mithai', 'Breakfast', 'Soups & Beverages', 'Navratri'],
    ratingBreakdown: { 5: 280, 4: 20, 3: 8, 2: 2, 1: 0 },
    totalRatings: 310,
  },
  {
    id: 5,
    slug: 'subhash',
    name: 'Subhash',
    role: 'Multi Cuisine Chef',
    city: 'Gurugram',
    experience: 10,
    rating: 4.7,
    events: 95,
    followers: 39,
    image: 'subhash.jpeg',
    bio: 'Subhash is a versatile Multi Cuisine Chef based in Gurugram with 10 years of experience. He has mastered a wide range of Indian and international cuisines, and excels in home catering, corporate lunches and custom platters, ensuring every guest leaves with a memorable dining experience.',
    awards: [
      { label: 'Tandoor Specialist', icon: 'flame' },
      { label: 'Punctual Person', icon: 'clock' },
      { label: 'Very Polite', icon: 'heart' },
      { label: 'Top Rated', icon: 'star' },
    ],
    serviceTypes: ['Personal Chef', 'Catering', 'Full Time Chef', 'Daily Chef'],
    cuisines: ['North Indian', 'South Indian', 'Indo-Chinese', 'Continental', 'BBQ & Grills'],
    ratingBreakdown: { 5: 80, 4: 10, 3: 3, 2: 2, 1: 0 },
    totalRatings: 95,
  },
  {
    id: 6,
    slug: 'ram-krishnan',
    name: 'Ram Krishnan',
    role: 'Multi Cuisine Chef',
    city: 'Delhi NCR',
    experience: 7,
    rating: 4.8,
    events: 140,
    followers: 61,
    image: 'ram_krishnan.jpeg',
    bio: 'Ram Krishnan is a Multi Cuisine Chef with 7 years of professional experience delivering exceptional culinary experiences in Delhi NCR. Passionate about bringing diverse flavours to the table, he specialises in South Indian, Indo-Chinese and Continental cuisines, making every event a gastronomic celebration.',
    awards: [
      { label: 'Top Rated Chef', icon: 'star' },
      { label: 'Punctual Person', icon: 'clock' },
      { label: 'Very Polite', icon: 'heart' },
      { label: 'Speedy Service', icon: 'zap' },
    ],
    serviceTypes: ['Personal Chef', 'Catering', 'Full Time Chef', 'Vacation Chef', 'Daily Chef', 'Cooking Classes'],
    cuisines: ['South Indian', 'Indo-Chinese', 'Continental', 'North Indian', 'Starters'],
    ratingBreakdown: { 5: 120, 4: 15, 3: 4, 2: 1, 1: 0 },
    totalRatings: 140,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const basePath = path.resolve(__dirname, '../../client/src/assets/chefs');
    let upserted = 0;

    for (const pro of professionals) {
      const imageFilename = pro.image; // already just filename
      const imagePath = path.join(basePath, imageFilename);
      const imageBuffer = fs.readFileSync(imagePath);
      const ext = path.extname(imageFilename).slice(1);
      const mime = ext === 'png' ? 'png' : 'jpeg';
      const base64 = imageBuffer.toString('base64');
      const imageDataUrl = `data:image/${mime};base64,${base64}`;

      const chefDoc = {
        name: pro.name,
        slug: pro.slug,
        role: pro.role,
        city: pro.city,
        experience: pro.experience,
        rating: pro.rating,
        events: pro.events,
        followers: pro.followers,
        image: imageDataUrl,
        bio: pro.bio,
        awards: pro.awards,
        serviceTypes: pro.serviceTypes,
        cuisines: pro.cuisines,
        ratingBreakdown: pro.ratingBreakdown,
        totalRatings: pro.totalRatings,
        displayStatus: 'Approved'
      };

      await Chef.findOneAndUpdate(
        { slug: pro.slug },
        chefDoc,
        { upsert: true, returnDocument: 'after' }
      );

      console.log(`  ✓ ${pro.name} (${pro.city})`);
      upserted++;
    }

    console.log(`\nDone. Upserted ${upserted} chefs.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
