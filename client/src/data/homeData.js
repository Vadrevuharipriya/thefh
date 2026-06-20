import axios from 'axios';

const cuisineImages = import.meta.glob('../assets/cuisine/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default'
})

const occasionImages = import.meta.glob('../assets/occasions/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default'
})

// ── Fallback slides embedded as disaster recovery ──────────
const fallbackHeroSlides = [
  {
    id: 1,
    tag: 'Banquet & Venue',
    title: 'Destination',
    titleAccent: 'Venues',
    subtitle: 'Luxurious banquet halls & outdoor venues for weddings, corporate galas & grand celebrations.',
    rating: 4.9,
    reviews: 1012,
    image: 'https://images.pexels.com/photos/34079355/pexels-photo-34079355.jpeg',
    link: '#',
  },
  {
    id: 2,
    tag: 'Halwai at Home',
    title: 'Expert Chefs',
    titleAccent: 'At Your Door',
    subtitle: 'Verified halwais & professional chefs for any occasion — from pooja to full-scale weddings.',
    rating: 4.5,
    reviews: 1440,
    image: 'https://images.pexels.com/photos/17294714/pexels-photo-17294714.jpeg',
    link: '#',
  },
  {
    id: 3,
    tag: 'Catering Services',
    title: 'Authentic',
    titleAccent: 'Indian Cuisine',
    subtitle: 'From North Indian thalis to Continental spreads — curated menus for 15+ occasion types.',
    rating: 4.9,
    reviews: 1012,
    image: 'https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg',
    link: '#',
  },
  {
    id: 4,
    tag: 'Celebrations',
    title: 'Unforgettable',
    titleAccent: 'Celebrations',
    subtitle: 'Birthday parties, anniversaries, house parties — every event deserves a perfect spread.',
    rating: 4.9,
    reviews: 1012,
    image: 'https://images.pexels.com/photos/30844787/pexels-photo-30844787.jpeg',
    link: '#',
  },
];

// mutable export — reassigned by initHomeData()
export const heroSlides = [];
let _heroSlidesCache = fallbackHeroSlides;
let _initialised = false;

function toHeroSlide(b) {
  return {
    id: b._id || b.sortOrder,
    tag: b.tag || '',
    title: b.title || '',
    titleAccent: b.titleAccent || '',
    subtitle: b.subtitle || '',
    image: b.image || '',
    rating: b.rating ?? 4.9,
    reviews: b.reviews ?? 0,
    link: b.link || '#',
  };
}

/** Replaces `heroSlides` contents with data fetched from the API. Called once on app start. */
export async function initHomeData(force = false) {
  if (_initialised && !force) return _heroSlidesCache;
  _initialised = true;
  try {
    const res = await axios.get('/api/banners', {
      params: { status: 'Approved' }
    });
    const approved = (res.data || []).filter(b => b.displayStatus === 'Approved');
    _heroSlidesCache = approved.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map(toHeroSlide);
  } catch (err) {
    console.error('[homeData] Failed to fetch banners from API, using fallback:', err);
    _heroSlidesCache = fallbackHeroSlides;
  }
  heroSlides.length = 0;
  heroSlides.push(..._heroSlidesCache);
  return _heroSlidesCache;
}

export function getHeroSlides() {
  return _heroSlidesCache || [];
}

export const stats = [
  { value: '10,000+', label: 'Happy Families', icon: '❤️' },
  { value: '15+', label: 'Cities Served', icon: '📍' },
  { value: '4.9', label: 'Google Rating', icon: '⭐' },
  { value: '99%', label: 'Success Rate', icon: '✅' },
];

export const occasions = [
  { id: 1, name: 'Wedding Functions', price: '₹799', image: occasionImages['../assets/occasions/wedding_functions.jpg'], link: '#', featured: true },
  { id: 2, name: 'Cocktail & Sangeet', price: '₹899', image: occasionImages['../assets/occasions/cocktail_sangeet.jpg'], link: '#', featured: true },
  { id: 3, name: 'Birthday Party', price: '₹499', image: occasionImages['../assets/occasions/birthday_party.jpg'], link: '#' },
  { id: 4, name: 'Gala Evening', price: '₹799', image: occasionImages['../assets/occasions/gala_evening.jpg'], link: '#' },
  { id: 5, name: 'High Tea Menu', price: '₹599', image: occasionImages['../assets/occasions/high_tea_menu.jpg'], link: '#' },
  { id: 6, name: 'Corporate Event', price: '₹799', image: occasionImages['../assets/occasions/corporate_event.jpg'], link: '#' },
  { id: 7, name: 'Roka Ceremony', price: '₹799', image: occasionImages['../assets/occasions/roka_ceremony.jpg'], link: '#' },
  { id: 8, name: 'Pooja at Home', price: '₹149', image: occasionImages['../assets/occasions/pooja_at_home.jpg'], link: '#' },
  { id: 9, name: 'Mehendi Cocktail', price: '₹599', image: occasionImages['../assets/occasions/mehendi_cocktail.jpg'], link: '#' },
  { id: 10, name: 'Kids Party', price: '₹799', image: occasionImages['../assets/occasions/kids_party.jpg'], link: '#' },
  { id: 11, name: 'House Party', price: '₹799', image: occasionImages['../assets/occasions/house_party.jpg'], link: '#' },
  { id: 12, name: 'Royal Lunch', price: '₹799', image: occasionImages['../assets/occasions/royal_lunch.jpg'], link: '#' },
  { id: 13, name: 'Bachelor Party', price: '₹799', image: occasionImages['../assets/occasions/bachelor_party.jpg'], link: '#' },
  { id: 14, name: 'No Onion No Garlic', price: '₹299', image: occasionImages['../assets/occasions/no_onion_no_garlic.jpg'], link: '#' },
  { id: 15, name: 'Anniversary', price: '₹799', image: occasionImages['../assets/occasions/anniversary.jpg'], link: '#' },
  { id: 16, name: 'Baby Shower', price: '₹799', image: occasionImages['../assets/occasions/baby_shower.png'], link: '#' },
  { id: 17, name: 'Continental Food', price: '₹799', image: occasionImages['../assets/occasions/continental_food.jpg'], link: '#' },
  { id: 18, name: 'Other Occasion', price: '₹199', image: occasionImages['../assets/occasions/other_occasion.jpg'], link: '#' },
];

export { professionals } from './professionalsData';

export const cuisines = [
  { id: 1, name: 'South Indian', image: cuisineImages['../assets/cuisine/south_indian.jpg'] },
  { id: 2, name: 'North Indian', image: cuisineImages['../assets/cuisine/north_indian.jpg'] },
  { id: 3, name: 'Indo-Chinese', image: cuisineImages['../assets/cuisine/indo_chinese.jpg'] },
  { id: 4, name: 'BBQ & Grills', image: cuisineImages['../assets/cuisine/bbq_grills.jpg'] },
  { id: 5, name: 'Breakfast', image: cuisineImages['../assets/cuisine/breakfast.jpg'] },
  { id: 6, name: 'Sweets & Mithai', image: cuisineImages['../assets/cuisine/sweets_mithai.jpg'] },
  { id: 7, name: 'Soups & Beverages', image: cuisineImages['../assets/cuisine/soups_beverages.jpg'] },
  { id: 8, name: 'Starters', image: cuisineImages['../assets/cuisine/starters.jpg'] },
  { id: 9, name: 'Breads & Rice', image: cuisineImages['../assets/cuisine/breads_rice.jpg'] },
];

// Real Google reviews — reviewer profile URLs sourced directly from Google Maps
export const testimonials = [
  {
    id: 1,
    name: 'Khushboo Rathore',
    handle: '@KhushbooRathore',
    text: "They handled everything for my dad's birthday. Real desi flavors. Definitely the best halwai near me.",
    time: '7 months ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=khushboorathore',
    reviewUrl: 'https://www.google.com/maps/contrib/107046883221419897588/reviews',
  },
  {
    id: 2,
    name: 'Parmanand Tiwari',
    handle: '@parmanandtiwari',
    text: 'The Famous Halwai is one of the best caterers till date. Choose them for my brother\'s wedding, they won our hearts. Owner\'s behaviour felt very good. I highly recommend.',
    time: '2 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=parmanandtiwari',
    reviewUrl: 'https://www.google.com/maps/contrib/108611199157090318415/reviews',
  },
  {
    id: 3,
    name: 'Shankar Khau',
    handle: '@shankarkhau',
    text: 'The Famous Halwai is the best catering service provider. The food is homecooked, light on stomach, not oily or extra-spicy and very tasty indeed. Also nicely packed and always delivered on time.',
    time: '2 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=shankarkhau',
    reviewUrl: 'https://www.google.com/maps/contrib/107794094124117932002/reviews',
  },
  {
    id: 4,
    name: 'Atita Nand Dubey',
    handle: '@atiitanandubey',
    text: 'Overall experience is good. The taste buds of each person are different so the cook should understand the family\'s nativity & culture before cooking. Cook Om Prakash was very good at his job.',
    time: '2 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=atiitanandubey',
    reviewUrl: 'https://www.google.com/maps/contrib/113966959628103745504/reviews',
  },
  {
    id: 5,
    name: 'Anil Gupta',
    handle: '@anilgupta',
    text: 'Thankyou for being able to take up orders in just 4 to 5 days and delivering on time. I first tried them at my house warming party — the food was without onion garlic and exceeded my expectations.',
    time: '3 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=anilgupta',
    reviewUrl: 'https://www.google.com/maps/contrib/111260680933857234234/reviews',
  },
  {
    id: 6,
    name: 'Usman Khan',
    handle: '@usmankhan',
    text: 'This food is amazing. Our wedding was almost 1 month ago now and people are still raving about the food! So many great food options and the price is right!! Absolutely recommend.',
    time: '6 years ago',
    rating: 5,
    avatar: 'https://i.pravatar.cc/60?u=usmankhan',
    reviewUrl: 'https://www.google.com/maps/contrib/108038519077786394207/reviews',
  },
];

const PX = '?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop';

export const cities = [
  { id: 1,  name: 'Delhi NCR',      image: `https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg${PX}`,    link: '/city/delhi-ncr' },
  { id: 2,  name: 'Dehradun',       image: `https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg${PX}`,  link: '/city/dehradun' },
  { id: 3,  name: 'Haridwar',       image: `https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg${PX}`,  link: '/city/haridwar' },
  { id: 4,  name: 'Faridabad',      image: `https://images.pexels.com/photos/14787318/pexels-photo-14787318.jpeg${PX}`,  link: '/city/faridabad' },
  { id: 5,  name: 'Rishikesh',      image: `https://images.pexels.com/photos/36123985/pexels-photo-36123985.jpeg${PX}`,  link: '/city/rishikesh' },
  { id: 6,  name: 'Lucknow',        image: `https://images.pexels.com/photos/17223838/pexels-photo-17223838.jpeg${PX}`,link: '/city/lucknow' },
  { id: 7,  name: 'Jaipur',         image: `https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg${PX}`,  link: '/city/jaipur' },
  { id: 8,  name: 'Tehri Garhwal',  image: `https://images.pexels.com/photos/36123985/pexels-photo-36123985.jpeg${PX}`,  link: '/city/tehri-garhwal' },
  { id: 9,  name: 'Gurugram',       image: `https://images.pexels.com/photos/29547311/pexels-photo-29547311.jpeg${PX}`,  link: '/city/gurugram' },
  { id: 10, name: 'Ghaziabad',      image: `https://images.pexels.com/photos/15059576/pexels-photo-15059576.jpeg${PX}`,  link: '/city/ghaziabad' },
  { id: 11, name: 'Yamunanagar',    image: `https://images.pexels.com/photos/14787318/pexels-photo-14787318.jpeg${PX}`,  link: '/city/yamunanagar' },
  { id: 12, name: 'Chandigarh',     image: `https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg${PX}`,  link: '/city/chandigarh' },
  { id: 13, name: 'Saharanpur',     image: `https://images.pexels.com/photos/12769720/pexels-photo-12769720.jpeg${PX}`,  link: '/city/saharanpur' },
  { id: 14, name: 'Agra',           image: `https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg${PX}`,  link: '/city/agra' },
  { id: 15, name: 'Bihar',          image: `https://images.pexels.com/photos/14237553/pexels-photo-14237553.jpeg${PX}`,  link: '/city/bihar' },
  { id: 16, name: 'Himachal Pradesh', image: `https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg${PX}`, link: '/city/himachal-pradesh' },
  { id: 17, name: 'Kolkata',        image: `https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg${PX}`,  link: '/city/kolkata' },
  { id: 18, name: 'Maharashtra',    image: `https://images.pexels.com/photos/28513284/pexels-photo-28513284.jpeg${PX}`,  link: '/city/maharashtra' },
  { id: 19, name: 'Punjab',         image: `https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg${PX}`,  link: '/city/punjab' },
  { id: 20, name: 'Karnal',         image: `https://images.pexels.com/photos/4400447/pexels-photo-4400447.jpeg${PX}`,  link: '/city/karnal' },
];

export const navOccasions = [
  'Cocktail & Sangeet', 'Gala Evening', 'High Tea Menu', 'No Onion No Garlic',
  'Continental Food', 'Royal Lunch', 'Roka Ceremony', 'Pooja at Home',
  'Mehendi Cocktail', 'Kids Party', 'House Party', 'Corporate Event',
  'Bachelor Party', 'Wedding Functions', 'Birthday Party', 'Anniversary',
  'Baby Shower', 'Other Occasion',
];

export const steps = [
  { id: 1, icon: '🔍', title: 'Choose the Service', description: 'Browse occasions, cuisines, and halwai packages tailored to your event.', color: '#C1272D' },
  { id: 2, icon: '📋', title: 'Share your Needs', description: 'Tell us your guest count, preferences, date and special dietary requirements.', color: '#DA9100' },
  { id: 3, icon: '🎉', title: 'Sit Back & Enjoy!', description: 'Our verified professionals handle everything — from setup to cleanup.', color: '#16a34a' },
];
