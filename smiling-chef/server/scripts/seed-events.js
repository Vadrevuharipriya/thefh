import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Event from './models/Event.js';

const defaultEvents = [
  { name: 'Good Friday',       slug: 'good-friday',       image: 'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=800', date: 'March - Apr', description: 'Commemorate the crucifixion of Jesus Christ.' },
  { name: 'Iftar Party',       slug: 'iftar-party',        image: 'https://images.pexels.com/photos/5857530/pexels-photo-5857530.jpeg?auto=compress&cs=tinysrgb&w=800', date: 'Ramadan',    description: 'Celebrate the joy of Ramadan with our Iftar spreads.' },
  { name: 'Holi',              slug: 'holi',               image: 'https://images.pexels.com/photos/3290241/pexels-photo-3290241.jpeg?auto=compress&cs=tinysrgb&w=800', date: 'March',      description: 'Festival of colours — thematic menus for Holi celebrations.' },
  { name: 'Diwali Party/Puja', slug: 'diwali-party-puja',  image: 'https://images.pexels.com/photos/1619641/pexels-photo-1619641.jpeg?auto=compress&cs=tinysrgb&w=800', date: 'Oct / Nov',  description: 'Festival of lights — premium Diwali & Puja catering packages.' },
  { name: 'Christmas Party',   slug: 'christmas-party',    image: 'https://images.pexels.com/photos/3755702/pexels-photo-3755702.jpeg?auto=compress&cs=tinysrgb&w=800', date: 'Dec 25',     description: 'Merry Christmas! Holiday feasts and party platters.' },
  { name: 'New Year Party',    slug: 'new-year-party',     image: 'https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg?auto=compress&cs=tinysrgb&w=800', date: 'Dec 31',     description: 'Ring in the new year with grand celebratory menus.' },
  { name: 'Bhai Dooj',         slug: 'bhai-dooj',          image: 'https://images.pexels.com/photos/8413114/pexels-photo-8413114.jpeg?auto=compress&cs=tinysrgb&w=800', date: 'Diwali Era', description: 'Celebrate the sibling bond with Bhai Dooj feasts.' },
];

const force = process.argv.includes('--force');

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const validSlugs = new Set(defaultEvents.map(e => e.slug));

    if (force) {
      // Remove all events then re-insert
      const deleted = await Event.deleteMany({});
      console.log(`  --force: removed ${deleted.deletedCount} existing event(s)`);
    } else {
      // Remove any events whose slug is NOT in our approved list (strays)
      const all = await Event.find();
      const strayIds = all.filter(e => !validSlugs.has(e.slug)).map(e => e._id);
      if (strayIds.length > 0) {
        await Event.deleteMany({ _id: { $in: strayIds } });
        console.log(`  Removed ${strayIds.length} stray event(s).`);
      }
    }

    console.log('\n— Seeding / refreshing events —');
    let upserted = 0;
    for (let i = 0; i < defaultEvents.length; i++) {
      const e = defaultEvents[i];
      await Event.findOneAndUpdate(
        { slug: e.slug },
        { ...e, displayOrder: i, displayStatus: 'Approved' },
        { upsert: true }
      );
      console.log(`  ✓ ${i + 1}. ${e.name} (${e.date})`);
      upserted++;
    }

    const total = await Event.countDocuments();
    console.log(`\nDone. Total events in DB: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
