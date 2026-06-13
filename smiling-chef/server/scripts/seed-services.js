import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Service from './models/Service.js';

const services = [
  {
    name: 'Halwai & Chefs',
    menuName: 'halwai-chefs',
    filename: 'halwai-chefs.jpg',
    metaTitle: 'Halwai & Chefs Services | Personal Chefs at Home',
    metaDesc: 'Book expert halwais and chefs for home cooking, events, and parties. Authentic traditional cuisine.',
    image: 'https://images.pexels.com/photos/4660384/pexels-photo-4660384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    displayStatus: 'Approved',
    isCategory: true
  },
  {
    name: 'Cater & Cloud Kitchen',
    menuName: 'cater-cloud-kitchen',
    filename: 'cater-cloud-kitchen.jpg',
    metaTitle: 'Catering & Cloud Kitchen Services | Large Event Catering',
    metaDesc: 'Professional catering for weddings, corporate events, and parties. Cloud kitchen with hygienic meal prep.',
    image: 'https://images.pexels.com/photos/5872401/pexels-photo-5872401.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    displayStatus: 'Approved',
    isCategory: true
  },
  {
    name: 'Ghar Se Dil Tak',
    menuName: 'ghar-se-dil-tak',
    filename: 'ghar-se-dil-tak.jpg',
    metaTitle: 'Homemade Tiffin, Achar, Chutney & Sweets | Ghar Se Dil Tak',
    metaDesc: 'Authentic homemade tiffin meals, pickles, chutneys, and sweets delivered fresh to your doorstep.',
    image: 'https://images.pexels.com/photos/2661455/pexels-photo-2661455.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    displayStatus: 'Approved',
    isCategory: true
  },
  {
    name: 'Other Services',
    menuName: 'other-services',
    filename: 'other-services.jpg',
    metaTitle: 'Other Services | Customized Catering Solutions',
    metaDesc: 'Customized catering solutions, dietary-specific meals, and special event services.',
    image: 'https://images.pexels.com/photos/6969662/pexels-photo-6969662.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    displayStatus: 'Approved',
    isCategory: true
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const validNames = new Set(services.map(s => s.name));

    // Remove any services whose name is NOT in our approved list (strays)
    const all = await Service.find();
    const strayIds = all.filter(s => !validNames.has(s.name)).map(s => s._id);
    if (strayIds.length > 0) {
      await Service.deleteMany({ _id: { $in: strayIds } });
      console.log(`  Removed ${strayIds.length} stray service(s).`);
    }

    let upserted = 0;
    for (const s of services) {
      await Service.findOneAndUpdate(
        { name: s.name },
        s,
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`  ✓ ${s.name}`);
      upserted++;
    }

   console.log(`\nDone. Upserted ${upserted} services.`);
    const allServices = await Service.find({}).sort({ name: 1 });
    console.log('All services:');
    allServices.forEach(s => console.log(`  ${s.name} (${s.menuName}) - ${s.displayStatus}`));
    console.log(`Total: ${allServices.length}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
