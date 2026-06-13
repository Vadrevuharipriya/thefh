import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Testimonial from './models/Testimonial.js';

// Testimonials data from homeData.js
const testimonials = [
  {
    name: 'Khushboo Rathore',
    handle: '@KhushbooRathore',
    text: 'They handled everything for my dad\'s birthday. Real desi flavors. Definitely the best halwai near me.',
    time: '7 months ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=khushboorathore',
    reviewUrl: 'https://www.google.com/maps/contrib/107046883221419897588/reviews',
  },
  {
    name: 'Parmanand Tiwari',
    handle: '@parmanandtiwari',
    text: 'The Famous Halwai is one of the best caterers till date. Choose them for my brother\'s wedding, they won our hearts. Owner\'s behaviour felt very good. I highly recommend.',
    time: '2 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=parmanandtiwari',
    reviewUrl: 'https://www.google.com/maps/contrib/108611199157090318415/reviews',
  },
  {
    name: 'Shankar Khau',
    handle: '@ShankarKhau',
    text: 'The Famous Halwai is the best catering service provider. The food is homecooked, light on stomach, not oily or extra-spicy and very tasty indeed. Also nicely packed and always delivered on time.',
    time: '2 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=shankarkhau',
    reviewUrl: 'https://www.google.com/maps/contrib/107794094124117932002/reviews',
  },
  {
    name: 'Atita Nand Dubey',
    handle: '@atiitanandubey',
    text: 'Overall experience is good. The taste buds of each person are different so the cook should understand the family\'s nativity & culture before cooking. Cook Om Prakash was very good at his job.',
    time: '2 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=atiitanandubey',
    reviewUrl: 'https://www.google.com/maps/contrib/113966959628103745504/reviews',
  },
  {
    name: 'Anil Gupta',
    handle: '@AnilGupta',
    text: 'Thankyou for being able to take up orders in just 4 to 5 days and delivering on time. I first tried them at my house warming party — the food was without onion garlic and exceeded my expectations.',
    time: '3 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=anilgupta',
    reviewUrl: 'https://www.google.com/maps/contrib/111260680933857234234/reviews',
  },
  {
    name: 'Usman Khan',
    handle: '@usmankhan',
    text: 'This food is amazing. Our wedding was almost 1 month ago now and people are still raving about the food! So many great food options and the price is right!! Absolutely recommend.',
    time: '6 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=usmankhan',
    reviewUrl: 'https://www.google.com/maps/contrib/108038519077786394207/reviews',
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    let upserted = 0;
    for (const t of testimonials) {
      await Testimonial.findOneAndUpdate(
        { name: t.name, text: t.text },
        t,
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`  ✓ ${t.name}`);
      upserted++;
    }

    console.log(`\nDone. Upserted ${upserted} testimonials.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
