import mongoose from 'mongoose';
import WebsitePage from './models/WebsitePage.js';
import Blog from './models/Blog.js';
import Cuisine from './models/Cuisine.js';
import Meal from './models/Meal.js';

async function sample() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/famous_halwai');

  console.log('=== Website Pages ===');
  const pages = await WebsitePage.find({}, 'title slug url');
  pages.forEach(p => console.log(`${p.slug.padEnd(20)} -> ${p.title} (${p.url})`));

  console.log('\n=== Sample Blogs ===');
  const blogs = await Blog.find({}, 'title slug category');
  blogs.forEach(b => console.log(`${b.slug.padEnd(40)} | ${b.category}`));

  console.log('\n=== Sample Cuisines ===');
  const cuisines = await Cuisine.find({}, 'name');
  cuisines.forEach(c => console.log(c.name));

  console.log('\n=== Sample Meals (first 10) ===');
  const meals = await Meal.find({}, 'name shortDescription').limit(10);
  meals.forEach(m => console.log(`${m.name} — ${m.shortDescription}`));

  console.log('\nDone.');
  process.exit(0);
}
sample().catch(e => { console.error(e); process.exit(1); });
