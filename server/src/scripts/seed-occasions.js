import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Occasion from './models/Occasion.js';

// Get current directory for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the occasion page data
import { occasionPageData } from '../../client/src/data/occasionPageData.js';

async function seedOccasions() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Path to the occasions images folder
    const assetsDir = path.resolve(__dirname, '../../client/src/assets/occasions');

    // Read all files in the assets directory
    const files = fs.readdirSync(assetsDir);

    // Build a map: slug (with hyphens) -> filename
    const slugToFile = {};
    for (const file of files) {
      const ext = path.extname(file).slice(1); // remove leading dot
      const base = path.basename(file, `.${ext}`);
      // Convert underscores (used in filenames) to hyphens (used in slugs)
      const slug = base.replace(/_/g, '-');
      slugToFile[slug] = { filename: file, ext };
    }

    let upserted = 0;
    let skipped = 0;

    for (const [slug, pageData] of Object.entries(occasionPageData)) {
      const fileInfo = slugToFile[slug];
      if (!fileInfo) {
        console.warn(`No image found for occasion slug: ${slug}`);
        skipped++;
        continue;
      }

      const imagePath = path.join(assetsDir, fileInfo.filename);
      const imageBuffer = fs.readFileSync(imagePath);
      const mime = fileInfo.ext === 'png' ? 'png' : 'jpeg';
      const base64 = imageBuffer.toString('base64');
      const imageDataUrl = `data:image/${mime};base64,${base64}`;

      // Convert slug to a readable name (title case)
      const name = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

       // Build the occasion document
       const occasionDoc = {
         name,
         pageUrl: slug,
         image: imageDataUrl,
         innerHeader: pageData.tagline || '',
         metaTitle: `${name} | The Famous Halwai`,
         metaKeyword: `${name}, catering, Delhi, event catering, Indian cuisine`,
         metaDesc: pageData.description,
         pageDescription: pageData.description,
         startingPrice: '',
         pricingEnabled: false,
         displayStatus: 'Approved'
       };

      // Upsert: update if exists by pageUrl, otherwise create
      await Occasion.findOneAndUpdate(
        { pageUrl: slug },
        occasionDoc,
        { upsert: true, new: true }
      );

      console.log(`Upserted occasion: ${name}`);
      upserted++;
    }

    console.log(`\nSeeding complete. Upserted: ${upserted}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seedOccasions();
