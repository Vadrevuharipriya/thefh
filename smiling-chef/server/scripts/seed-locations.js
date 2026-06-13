import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Location from './models/Location.js';

// All cities with name, slug, and image URL
const cities = [
  { name: 'Delhi NCR',      slug: 'delhi-ncr',     image: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Dehradun',       slug: 'dehradun',       image: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Haridwar',       slug: 'haridwar',       image: 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Faridabad',      slug: 'faridabad',      image: 'https://images.pexels.com/photos/14787318/pexels-photo-14787318.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Rishikesh',      slug: 'rishikesh',      image: 'https://images.pexels.com/photos/36123985/pexels-photo-36123985.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Lucknow',        slug: 'lucknow',        image: 'https://images.pexels.com/photos/17223838/pexels-photo-17223838.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Jaipur',         slug: 'jaipur',         image: 'https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Tehri Garhwal',  slug: 'tehri-garhwal',  image: 'https://images.pexels.com/photos/36123985/pexels-photo-36123985.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Gurugram',       slug: 'gurugram',       image: 'https://images.pexels.com/photos/29547311/pexels-photo-29547311.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Ghaziabad',      slug: 'ghaziabad',      image: 'https://images.pexels.com/photos/15059576/pexels-photo-15059576.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Yamunanagar',    slug: 'yamunanagar',    image: 'https://images.pexels.com/photos/14787318/pexels-photo-14787318.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Chandigarh',     slug: 'chandigarh',     image: 'https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Saharanpur',     slug: 'saharanpur',     image: 'https://images.pexels.com/photos/12769720/pexels-photo-12769720.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Agra',           slug: 'agra',           image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Bihar',          slug: 'bihar',          image: 'https://images.pexels.com/photos/14237553/pexels-photo-14237553.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', image: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Kolkata',        slug: 'kolkata',        image: 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Maharashtra',    slug: 'maharashtra',    image: 'https://images.pexels.com/photos/28513284/pexels-photo-28513284.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Punjab',         slug: 'punjab',         image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
  { name: 'Karnal',         slug: 'karnal',         image: 'https://images.pexels.com/photos/4400447/pexels-photo-4400447.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop' },
];

async function seedLocations() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    let upserted = 0;
    let skipped = 0;

    for (const city of cities) {
      const locationDoc = {
        name: city.name,
        slug: city.slug,
        image: city.image,
        displayStatus: 'Approved'
      };

      await Location.findOneAndUpdate(
        { slug: city.slug },
        locationDoc,
        { upsert: true, new: true }
      );

      console.log(`Upserted location: ${city.name}`);
      upserted++;
    }

    console.log(`\nSeeding complete. Upserted: ${upserted}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seedLocations();
