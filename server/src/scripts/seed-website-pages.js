import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import WebsitePage from './models/WebsitePage.js';

// Static website pages
const pages = [
  {
    title: 'About Us',
    slug: 'about',
    url: '/about',
    metaTitle: 'About The Famous Halwai | Delhi NCR\'s Trusted Catering Service',
    metaDescription: 'Learn about The Famous Halwai — our story, values, expert chefs, and why we are Delhi NCR\'s most trusted catering and halwai service since 2018.',
    pageType: 'static',
    content: `
      <section class="page-hero" style="background-image: url('https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg')">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <nav class="breadcrumb"><a href="/">Home</a> / <span>About Us</span></nav>
          <h1>About <span class="text-brand-red">Us</span></h1>
          <p class="subtitle">Delhi NCR's most trusted catering & halwai service — bringing authentic flavours to your celebrations since day one.</p>
        </div>
      </section>
      <section class="stats-strip">
        <div class="stat-item"><span class="icon">❤️</span><p>10,000+</p><span>Happy Families</span></div>
        <div class="stat-item"><span class="icon">📍</span><p>15+</p><span>Cities Served</span></div>
        <div class="stat-item"><span class="icon">⭐</span><p>4.9</p><span>Google Rating</span></div>
        <div class="stat-item"><span class="icon">✅</span><p>99%</p><span>Success Rate</span></div>
      </section>
      <section class="story-section">
        <h2>Serving <span class="text-brand-red">Authentic</span> Flavours Across Delhi NCR</h2>
        <p>The Famous Halwai is renowned for its state-of-the-art catering services for personal parties, office parties and public gatherings. We understand the intricacies of the trade and our years of experience has earned us a place among the leading caterers in Delhi NCR. Customer satisfaction is our primary goal and we make sure to be consistent on high standards.</p>
        <p>With The Famous Halwai, your parties, gatherings and celebrations turn into a gala event the world will remember! You get the choice of regional and international cuisine and our innovative style in menus as well as serving will win over every guest. Rely upon our years of experience in the hospitality industry and quest for the latest trends in catering services.</p>
        <p>As the leading caterers in Delhi NCR, exceeding your every expectation constantly and consistently is our motto. We are loved and trusted by many of our clients due to the efficiency, professionalism, friendly attitude and helpful behaviour reflected in our service. We let our work do the talking.</p>
      </section>
      <section class="cta-section">
        <h2>Ready to Plan Your <span class="text-brand-gold">Perfect Event?</span></h2>
        <a href="tel:+918926262674" class="btn btn-white">Call Us Now</a>
        <a href="https://wa.me/918926262674" class="btn btn-outline">WhatsApp</a>
      </section>
    `,
    featuredImage: 'https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg'
  },
  {
    title: 'Contact Us',
    slug: 'contact',
    url: '/contact',
    metaTitle: 'Contact The Famous Halwai | Catering Enquiries & Support',
    metaDescription: 'Get in touch with The Famous Halwai for catering enquiries, menu customisation, and bookings. Call or WhatsApp us for a quick response.',
    pageType: 'static',
    content: `
      <section class="page-hero" style="background-image: url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg')">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <nav class="breadcrumb"><a href="/">Home</a> / <span>Contact Us</span></nav>
          <h1>Contact <span class="text-brand-red">Us</span></h1>
          <p class="subtitle">We'd love to hear from you. Reach out for bookings, custom menus, or any query.</p>
        </div>
      </section>
      <section class="contact-section">
        <div class="contact-card">
          <h3>📞 Phone</h3>
          <p><a href="tel:+918926262674">+91-8926262674</a></p>
          <p><a href="tel:+918926262675">+91-8926262675</a></p>
        </div>
        <div class="contact-card">
          <h3>💬 WhatsApp</h3>
          <p><a href="https://wa.me/918926262674?text=Hello!%20I%20am%20looking%20for%20a%20Halwai%20%26%20Chef.">Chat with us</a></p>
        </div>
        <div class="contact-card">
          <h3>📧 Email</h3>
          <p><a href="mailto:info@thefamoushalwai.com">info@thefamoushalwai.com</a></p>
        </div>
        <div class="contact-card">
          <h3>📍 Service Area</h3>
          <p>Delhi NCR, Faridabad, Gurugram, Noida, Ghaziabad, Dehradun, Haridwar, Rishikesh, Lucknow, Jaipur, Chandigarh, Agra, and more.</p>
        </div>
      </section>
    `,
    featuredImage: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg'
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms',
    url: '/terms',
    metaTitle: 'Terms & Conditions | The Famous Halwai',
    metaDescription: 'Read the terms and conditions for using The Famous Halwai services.',
    pageType: 'static',
    content: `
      <section class="page-hero" style="background-image: url('https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg')">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <nav class="breadcrumb"><a href="/">Home</a> / <span>Terms & Conditions</span></nav>
          <h1>Terms & <span class="text-brand-red">Conditions</span></h1>
        </div>
      </section>
      <section class="content-section">
        <h2>1. Acceptance of Terms</h2>
        <p>By using our services, you agree to be bound by these Terms & Conditions.</p>
        <h2>2. Services</h2>
        <p>The Famous Halwai provides catering, halwai, and chef services subject to availability and confirmed booking.</p>
        <h2>3. Payments</h2>
        <p>Payment terms will be communicated at the time of booking. A advance deposit may be required.</p>
        <h2>4. Cancellations</h2>
        <p>Cancellation policies vary by event type and notice period. Please discuss at booking.</p>
        <h2>5. Liability</h2>
        <p>While we take utmost care with food preparation and service, we are not liable for allergic reactions or acts of God.</p>
        <p>Last updated: May 2026</p>
      </section>
    `,
    featuredImage: 'https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg'
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    url: '/privacy',
    metaTitle: 'Privacy Policy | The Famous Halwai',
    metaDescription: 'Privacy policy for The Famous Halwai — how we collect, use, and protect your data.',
    pageType: 'static',
    content: `
      <section class="page-hero" style="background-image: url('https://images.pexels.com/photos/1181227/pexels-photo-1181227.jpeg')">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <nav class="breadcrumb"><a href="/">Home</a> / <span>Privacy Policy</span></nav>
          <h1>Privacy <span class="text-brand-red">Policy</span></h1>
        </div>
      </section>
      <section class="content-section">
        <h2>1. Information We Collect</h2>
        <p>We collect personal information such as name, phone, email, and event details when you contact us or book a service.</p>
        <h2>2. Use of Information</h2>
        <p>We use your information to provide catering services, communicate with you, and improve our offerings.</p>
        <h2>3. Data Security</h2>
        <p>We implement industry-standard security to protect your data from unauthorised access.</p>
        <h2>4. Third Parties</h2>
        <p>We do not sell your personal data. We may share with service partners only as required to deliver your order.</p>
        <p>Last updated: May 2026</p>
      </section>
    `,
    featuredImage: 'https://images.pexels.com/photos/1181227/pexels-photo-1181227.jpeg'
  },
  {
    title: 'Refund Policy',
    slug: 'refund',
    url: '/refund-policy',
    metaTitle: 'Refund Policy | The Famous Halwai',
    metaDescription: 'Refund and cancellation policy for The Famous Halwai catering services.',
    pageType: 'static',
    content: `
      <section class="page-hero" style="background-image: url('https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg')">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <nav class="breadcrumb"><a href="/">Home</a> / <span>Refund Policy</span></nav>
          <h1>Refund <span class="text-brand-red">Policy</span></h1>
        </div>
      </section>
      <section class="content-section">
        <h2>1. Cancellation by Customer</h2>
        <p>Advance deposits are generally non-refundable. Please discuss cancellation terms at booking.</p>
        <h2>2. Cancellation by Us</h2>
        <p>In the unlikely event we must cancel, full refund of any advance will be provided.</p>
        <h2>3. Force Majeure</h2>
        <p>We are not liable for refunds in case of events beyond our reasonable control.</p>
        <p>Last updated: May 2026</p>
      </section>
    `,
    featuredImage: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg'
  },
  {
    title: 'FAQ',
    slug: 'faq',
    url: '/faq',
    metaTitle: 'Frequently Asked Questions | The Famous Halwai',
    metaDescription: 'Find answers to common questions about our catering, halwai, and chef services.',
    pageType: 'static',
    content: `
      <section class="page-hero" style="background-image: url('https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg')">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <nav class="breadcrumb"><a href="/">Home</a> / <span>FAQ</span></nav>
          <h1>Frequently Asked <span class="text-brand-red">Questions</span></h1>
        </div>
      </section>
      <section class="content-section">
        <h2>General</h2>
        <p><strong>Q: What areas do you serve?</strong><br>A: We serve Delhi NCR, Noida, Gurugram, Faridabad, Ghaziabad, Dehradun, Haridwar, Rishikesh, Lucknow, Jaipur, Chandigarh, Agra, and other major cities across North India.</p>
        <p><strong>Q: How do I book a chef?</strong><br>A: Contact us via phone or WhatsApp, share your requirements, and we'll match you with a verified chef.</p>
        <p><strong>Q: Do you provide custom menus?</strong><br>A: Yes, we tailor menus to your preferences, dietary needs, and event type.</p>
        <p><strong>Q: What is the minimum advance?</strong><br>A: This varies by event. Our team will share details during consultation.</p>
        <p>For more questions, <a href="/contact">contact us</a>.</p>
      </section>
    `,
    featuredImage: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg'
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    let upserted = 0;
    for (const p of pages) {
      await WebsitePage.findOneAndUpdate(
        { slug: p.slug },
        p,
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`  ✓ ${p.title}`);
      upserted++;
    }
    console.log(`\nDone. Upserted ${upserted} website pages.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
