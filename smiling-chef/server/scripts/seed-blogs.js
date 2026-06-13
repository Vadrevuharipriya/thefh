import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Blog from './models/Blog.js';

const blogs = [
  {
    title: '10 Tips for Planning the Perfect Catered Event',
    slug: 'tips-planning-perfect-catered-event',
    excerpt: 'Planning an event? Here are 10 expert tips to ensure your catering is a memorable success.',
    content: `<p>Hosting a successful catered event requires careful planning and attention to detail. Here are our top 10 tips:</p>
<ol>
  <li><strong>Know your guest count</strong> — Accurate numbers help us prepare just the right amount.</li>
  <li><strong>Consider dietary needs</strong> — Include vegetarian, vegan, and allergy-friendly options.</li>
  <li><strong>Choose the right cuisine</strong> — Match the food to your event's theme and audience.</li>
  <li><strong>Taste before you commit</strong> — Always schedule a tasting session with your chef.</li>
  <li><strong>Plan the timeline</strong> — Service timing should align with your programme.</li>
  <li><strong>Space & setup</strong> — Ensure there's adequate room for serving and dining.</li>
  <li><strong>Staffing</strong> — Confirm the number of servers and helpers included.</li>
  <li><strong>Leftovers plan</strong> — Decide how to handle extra food (takeaway, donation).</li>
  <li><strong>Budget buffer</strong> — Include a small buffer for unexpected costs.</li>
  <li><strong>Communicate clearly</strong> — Keep in touch with your caterer leading up to the event.</li>
</ol>
<p>With these tips and The Famous Halwai's expert team, your event is set to impress!</p>`,
    image: 'https://images.pexels.com/photos/1699930/pexels-photo-1699930.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    category: 'Catering Tips',
    author: 'The Famous Halwai Team',
    published: true
  },
  {
    title: 'A Food Lover\'s Guide to North Indian Cuisine',
    slug: 'food-lovers-guide-north-indian-cuisine',
    excerpt: 'From buttery dal makhani to succulent kebabs — explore the rich flavours of North Indian food.',
    content: `<p>North Indian cuisine is celebrated for its rich, creamy curries, succulent kebabs, and an array of breads. Here's a food lover's guide to the must-try dishes:</p>
<ul>
  <li><strong>Dal Makhani</strong> — Creamy black lentils slow-cooked with butter and cream.</li>
  <li><strong>Butter Chicken</strong> — Tandoori chicken in a spiced tomato-cashew gravy.</li>
  <li><strong>Paneer Tikka</strong> — Marinated cottage cheese cubes grilled to perfection.</li>
  <li><strong>Naan & Garlic Naan</strong> — Soft, leavened flatbreads baked in a tandoor.</li>
  <li><strong>Chole Bhature</strong> — Spicy chickpea curry with fluffy fried bread.</li>
  <li><strong>Gulab Jamun</strong> — Deep-fried milk-solid dough balls soaked in sugar syrup.</li>
</ul>
<p>At The Famous Halwai, our expert halwais prepare these classics with authentic recipes and the finest ingredients.</p>`,
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    category: 'Cuisine Guide',
    author: 'The Famous Halwai Team',
    published: true
  },
  {
    title: 'Why Hiring a Personal Chef Can Transform Your Celebrations',
    slug: 'why-hire-personal-chef',
    excerpt: 'Discover how a personal chef brings restaurant-quality cuisine to the comfort of your home.',
    content: `<p>Hiring a personal chef for your next celebration offers numerous benefits:</p>
<p><strong>Customised Menus:</strong> Tailor dishes to your family's tastes and dietary requirements.</p>
<p><strong>More Time to Celebrate:</strong> Let the chef handle cooking and cleanup while you enjoy with guests.</p>
<p><strong>Professional Quality:</strong> Restaurant-grade flavours without leaving home.</p>
<p><strong>Hygiene & Safety:</strong> Our chefs maintain the highest standards of cleanliness.</p>
<p>Whether it's a birthday, anniversary, or a pooja at home, our verified chefs ensure a delightful culinary experience for you and your guests.</p>`,
    image: 'https://images.pexels.com/photos/7668774/pexels-photo-7668774.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    category: 'Chef Stories',
    author: 'The Famous Halwai Team',
    published: true
  },
  {
    title: 'The Art of Sattvic Catering: Pure, Simple, Divine',
    slug: 'art-of-sattvic-catering',
    excerpt: 'Explore the tradition of sattvic food — pure, vegetarian cuisine that nourishes body and soul.',
    content: `<p>Sattvic cuisine is rooted in Ayurvedic principles and emphasizes fresh, pure, and lightly spiced vegetarian food. It is particularly popular for religious ceremonies, poojas, and spiritual gatherings in cities like Haridwar and Rishikesh.</p>
<p>Key characteristics:</p>
<ul>
  <li><strong>No onion, no garlic</strong> — believed to increase Rajas and Tamas.</li>
  <li><strong>Fresh ingredients</strong> — cooked and served the same day.</li>
  <li><strong>Mild spices</strong> — just enough to aid digestion without overpowering.</li>
  <li><strong>Satvik bhog</strong> — offered to deities before distribution.</li>
</ul>
<p>The Famous Halwai offers authentic sattvic catering in Haridwar, Rishikesh, and nearby spiritual centres. Our chefs prepare food with devotion, ensuring purity and taste.</p>`,
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    category: 'Cuisine Guide',
    author: 'The Famous Halwai Team',
    published: true
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    let upserted = 0;
    for (const b of blogs) {
      await Blog.findOneAndUpdate(
        { slug: b.slug },
        { ...b, date: new Date(b.date || Date.now()) },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`  ✓ ${b.title}`);
      upserted++;
    }
    console.log(`\nDone. Upserted ${upserted} blogs.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
