/**
 * Rich content for each occasion service page.
 * Key = URL slug (slugify(occasion.name))
 */
export const occasionPageData = {
  'wedding-functions': {
    badge: 'Most Popular',
    tagline: 'Create memories that last a lifetime',
    description:
      'Your wedding is the most important day of your life — and The Famous Halwai ensures every bite is as memorable as the vows. Our master halwais and chefs craft authentic Indian spreads for 200 to 2000+ guests, covering every ritual from mehendi to vidaai.',
    stats: [
      { icon: '👥', label: 'Guests', value: '200–2000+' },
      { icon: '⏱️', label: 'Service', value: 'Full Day' },
      { icon: '👨‍🍳', label: 'Staff', value: '20–80 persons' },
      { icon: '📅', label: 'Advance Booking', value: '7+ days' },
    ],
    features: [
      { icon: '🍽️', title: 'Grand Buffet Setup', desc: 'Live counters, chaats, desserts & full meal service for every function.' },
      { icon: '🎨', title: 'Custom Menu Planning', desc: 'Personalised menu curated to your family traditions & regional cuisine.' },
      { icon: '🌿', title: 'Veg & Non-Veg Options', desc: 'Comprehensive choices for all dietary preferences.' },
      { icon: '🧑‍🍳', title: 'Expert Halwai Team', desc: 'Background-verified halwais with 10+ years of wedding experience.' },
      { icon: '✨', title: 'Elegant Presentation', desc: 'Chafing dishes, decorative platters and professional service ware.' },
      { icon: '🧹', title: 'Setup & Cleanup', desc: 'We handle everything from setup to post-event cleanup so you relax.' },
    ],
    menuHighlights: [
      'Dal Makhani', 'Paneer Butter Masala', 'Shahi Biryani', 'Kadhai Chicken',
      'Chole Bhature', 'Gajar ka Halwa', 'Gulab Jamun', 'Malpua',
      'Dahi Bhalla', 'Pani Puri Counter', 'Jalebi Fresh', 'Raita Assortment',
    ],
  },

  'cocktail-sangeet': {
    badge: 'High Energy',
    tagline: 'Dance, dine & celebrate the night away',
    description:
      'The sangeet and cocktail night demand a menu as vibrant as the celebrations. Think live chaat counters, themed cocktail snacks, fusion appetisers and a dessert bar that keeps the energy high all night long.',
    stats: [
      { icon: '👥', label: 'Guests', value: '100–800' },
      { icon: '⏱️', label: 'Service', value: '4–6 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '10–40 persons' },
      { icon: '📅', label: 'Advance Booking', value: '5+ days' },
    ],
    features: [
      { icon: '🥂', title: 'Themed Cocktail Snacks', desc: 'Curated finger foods and canapes matching your event theme.' },
      { icon: '🍢', title: 'Live Chaat Counter', desc: 'Interactive chaat station — pani puri, bhel, dahi bhalla and more.' },
      { icon: '🎉', title: 'Party-Style Plating', desc: 'Colourful, Instagram-worthy presentation for every dish.' },
      { icon: '🍰', title: 'Dessert Bar', desc: 'Mini sweets, kulfi, rabdi and fusion desserts to end on a high.' },
      { icon: '🌮', title: 'Fusion Starters', desc: 'Tandoori sliders, paneer tikka tacos and more crowd-pleasers.' },
      { icon: '🛎️', title: 'Butler Service', desc: 'Roaming staff serve guests directly on the dance floor.' },
    ],
    menuHighlights: [
      'Paneer Tikka', 'Seekh Kebab', 'Dahi Bhalla', 'Pani Puri Counter',
      'Mini Samosas', 'Kulfi Falooda', 'Tandoori Platter', 'Fruit Chaat',
    ],
  },

  'birthday-party': {
    badge: 'Fan Favourite',
    tagline: 'Make every birthday truly special',
    description:
      'From a child\'s first birthday to a milestone 50th, we bring the flavours and fun. Our birthday catering is flexible — pick from a casual buffet to a plated sit-down dinner, with a custom cake table and live counters.',
    stats: [
      { icon: '👥', label: 'Guests', value: '30–500' },
      { icon: '⏱️', label: 'Service', value: '3–5 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '5–20 persons' },
      { icon: '📅', label: 'Advance Booking', value: '3+ days' },
    ],
    features: [
      { icon: '🎂', title: 'Custom Cake Table', desc: 'We coordinate with your cake supplier for a stunning centrepiece.' },
      { icon: '🍕', title: 'Flexible Menu', desc: 'Indian, continental or fusion — tailored to the birthday star.' },
      { icon: '🍿', title: 'Snack Counters', desc: 'Pop corn, chaat, chat and munch stations kids and adults love.' },
      { icon: '🥗', title: 'Healthy Options', desc: 'Salad bar and diet-friendly dishes for health-conscious guests.' },
      { icon: '🎈', title: 'Themed Platters', desc: 'Colour-coordinated food presentation matching your party theme.' },
      { icon: '📦', title: 'Return Gift Mithai', desc: 'Customised mithai boxes for guests as sweet take-aways.' },
    ],
    menuHighlights: [
      'Mini Burgers', 'Pasta Station', 'Pav Bhaji', 'Paneer Tikka',
      'Birthday Cake', 'Ice Cream Bar', 'Pani Puri', 'Samosa Chaat',
    ],
  },

  'gala-evening': {
    badge: 'Premium',
    tagline: 'Elevate your evening with world-class cuisine',
    description:
      'A gala evening calls for nothing less than excellence. Our premium catering team delivers a sophisticated multi-course experience with fine platings, continental and Indian fusion cuisine, and white-glove service.',
    stats: [
      { icon: '👥', label: 'Guests', value: '100–1000' },
      { icon: '⏱️', label: 'Service', value: '5–7 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '15–60 persons' },
      { icon: '📅', label: 'Advance Booking', value: '7+ days' },
    ],
    features: [
      { icon: '🥘', title: 'Multi-Course Dining', desc: 'Appetisers, soups, mains, desserts — a full gourmet journey.' },
      { icon: '🕯️', title: 'Fine Plating', desc: 'Restaurant-quality presentation for every course.' },
      { icon: '🌍', title: 'Global Cuisine', desc: 'Indian, Continental, Mediterranean and more on a single menu.' },
      { icon: '🥂', title: 'Welcome Drink Station', desc: 'Mocktails, nimbu pani and signature welcome beverages.' },
      { icon: '🎻', title: 'Coordinated Service', desc: 'Synchronized plating and clearing for a seamless experience.' },
      { icon: '🏆', title: 'Award-Winning Chefs', desc: 'Executive chefs with hotel-standard training and experience.' },
    ],
    menuHighlights: [
      'Soup du Jour', 'Caesar Salad', 'Butter Chicken', 'Lamb Rogan Josh',
      'Grilled Vegetables', 'Panna Cotta', 'Tiramisu', 'Gulab Jamun',
    ],
  },

  'high-tea-menu': {
    badge: 'Elegant',
    tagline: 'Sophisticated bites for distinguished gatherings',
    description:
      'An afternoon high tea curated with both British classics and Indian twists. Perfect for kitty parties, ladies meets, or corporate pre-events. Delicate sandwiches, freshly baked scones and artisanal Indian mithai served in style.',
    stats: [
      { icon: '👥', label: 'Guests', value: '20–200' },
      { icon: '⏱️', label: 'Service', value: '2–3 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '4–15 persons' },
      { icon: '📅', label: 'Advance Booking', value: '2+ days' },
    ],
    features: [
      { icon: '🫖', title: 'Artisan Tea Selection', desc: 'Darjeeling, green, masala chai and herbal infusions.' },
      { icon: '🥪', title: 'Finger Sandwiches', desc: 'Classic cucumber, smoked paneer and chutney sandwiches.' },
      { icon: '🧁', title: 'Freshly Baked Pastries', desc: 'Scones, mini cakes, tarts and éclairs.' },
      { icon: '🍬', title: 'Indian Mithai Tray', desc: 'Barfi, laddoo, kaju katli and peda presented on a platter.' },
      { icon: '🌿', title: 'Healthy Options', desc: 'Fruit skewers, yogurt parfaits and low-calorie bites.' },
      { icon: '🎀', title: 'Elegant Table Decor', desc: 'Tiered stands, floral centrepieces and fine crockery.' },
    ],
    menuHighlights: [
      'Masala Chai', 'Darjeeling Tea', 'Cucumber Sandwiches', 'Scones',
      'Kaju Katli', 'Mini Eclairs', 'Fruit Tarts', 'Paneer Tikka Bites',
    ],
  },

  'corporate-event': {
    badge: 'Professional',
    tagline: 'Impress your clients and motivate your team',
    description:
      'From working lunches to grand annual dinners, we have the corporate catering experience to match your brand\'s standards. Punctual, professional and completely customisable — right down to your company colours on the presentation.',
    stats: [
      { icon: '👥', label: 'Guests', value: '50–2000' },
      { icon: '⏱️', label: 'Service', value: '2–8 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '8–60 persons' },
      { icon: '📅', label: 'Advance Booking', value: '5+ days' },
    ],
    features: [
      { icon: '⏰', title: 'On-Time Guarantee', desc: 'Punctual setup and service — we never delay your schedule.' },
      { icon: '🏢', title: 'Office & Venue Ready', desc: 'We set up in office cafeterias, conference halls or outdoor venues.' },
      { icon: '🥗', title: 'Healthy Corporate Menu', desc: 'Nutritious, light options alongside hearty Indian and continental.' },
      { icon: '📋', title: 'Dietary Management', desc: 'Jain, vegan, gluten-free and allergen labels on every dish.' },
      { icon: '🎖️', title: 'Branded Presentation', desc: 'Custom napkin folds, table cards and branding on request.' },
      { icon: '🧹', title: 'Zero-Mess Cleanup', desc: 'Full post-event cleanup included so your office stays spotless.' },
    ],
    menuHighlights: [
      'Working Lunch Box', 'Dal Rice Combo', 'Sandwich Platter', 'Salad Bar',
      'Paneer Curry', 'Fresh Rotis', 'Cold Beverages', 'Dessert Basket',
    ],
  },

  'roka-ceremony': {
    badge: 'Auspicious',
    tagline: 'The perfect start to a beautiful journey',
    description:
      "A Roka ceremony marks the official beginning of a family's union. Our catering is designed to honour this sacred occasion — traditional Indian fare, mithai specials and warm hospitality for the intimate gathering of both families.",
    stats: [
      { icon: '👥', label: 'Guests', value: '30–200' },
      { icon: '⏱️', label: 'Service', value: '3–4 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '5–15 persons' },
      { icon: '📅', label: 'Advance Booking', value: '3+ days' },
    ],
    features: [
      { icon: '🪔', title: 'Traditional Fare', desc: 'Authentic regional dishes to welcome both families with warmth.' },
      { icon: '🍮', title: 'Mithai Special', desc: 'Custom mithai platters — the centrepiece of every Roka table.' },
      { icon: '🍚', title: 'Full Meal Service', desc: 'Complete lunch or dinner with dal, sabzi, roti, rice and more.' },
      { icon: '🙏', title: 'Pooja Prasad', desc: 'Panchamrit, fruits and puja thali items arranged on request.' },
      { icon: '🌸', title: 'Intimate Setting', desc: 'Warm, family-friendly service atmosphere for close gatherings.' },
      { icon: '🎁', title: 'Gift Mithai Boxes', desc: 'Presentation boxes of assorted sweets for exchange of gifts.' },
    ],
    menuHighlights: [
      'Puri Sabzi', 'Dal Tadka', 'Paneer Curry', 'Gajar Halwa',
      'Kheer', 'Assorted Mithai', 'Aam Panna', 'Gulab Jamun',
    ],
  },

  'pooja-at-home': {
    badge: 'Sattvic',
    tagline: 'Pure, divine flavours for sacred occasions',
    description:
      'Whether it\'s Satyanarayan Katha, Griha Pravesh or Navratri pooja — our sattvic catering brings peace of mind along with pristine food. Strictly no onion, no garlic. Cooked with devotion, served with purity.',
    stats: [
      { icon: '👥', label: 'Guests', value: '10–100' },
      { icon: '⏱️', label: 'Service', value: '2–4 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '3–10 persons' },
      { icon: '📅', label: 'Advance Booking', value: '1+ day' },
    ],
    features: [
      { icon: '🌿', title: 'No Onion No Garlic', desc: '100% sattvic preparations, perfect for all puja occasions.' },
      { icon: '🪔', title: 'Prasad Preparation', desc: 'Traditional prasad — panchamrit, halwa, puri and more.' },
      { icon: '🍛', title: 'Langar-Style Serving', desc: 'Simple, wholesome food served with love for all attendees.' },
      { icon: '📿', title: 'Ritual Support', desc: 'Our team can also help arrange puja materials on request.' },
      { icon: '✅', title: 'Hygienic Cooking', desc: 'Food prepared fresh with sanitised utensils and hands.' },
      { icon: '🏡', title: 'Home Setup', desc: 'We work in your kitchen or set up a portable cooking station.' },
    ],
    menuHighlights: [
      'Suji Halwa', 'Puri', 'Aloo Sabzi', 'Kheer', 'Makhana Curry',
      'Sabudana Khichdi', 'Panchamrit', 'Fruit Chaat',
    ],
  },

  'mehendi-cocktail': {
    badge: 'Fun & Festive',
    tagline: 'Colourful celebrations deserve colourful food',
    description:
      'Mehendi ceremonies are lively, informal and bursting with colour — and so is our food! Expect vibrant chaat counters, fun fusion bites, refreshing beverages and a dessert spread that\'s as Instagrammable as the henna.',
    stats: [
      { icon: '👥', label: 'Guests', value: '50–400' },
      { icon: '⏱️', label: 'Service', value: '4–5 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '8–25 persons' },
      { icon: '📅', label: 'Advance Booking', value: '3+ days' },
    ],
    features: [
      { icon: '🌈', title: 'Colourful Chaat Station', desc: 'Rainbow-plated chaats to match the mehendi vibes.' },
      { icon: '🍹', title: 'Mocktail Bar', desc: 'Virgin mojitos, rose sharbat, aam panna and more.' },
      { icon: '🎊', title: 'Themed Bites', desc: 'Colour-coordinated snacks matching your mehendi palette.' },
      { icon: '🍦', title: 'Kulfi Bar', desc: 'Classic kesar, paan and mango kulfi on sticks.' },
      { icon: '📸', title: 'Photo-Worthy Platters', desc: 'Beautifully styled plates perfect for your wedding album.' },
      { icon: '🛎️', title: 'Roving Service', desc: 'Staff move through the crowd serving guests while they get mehendi.' },
    ],
    menuHighlights: [
      'Pani Puri', 'Papdi Chaat', 'Raj Kachori', 'Kulfi Falooda',
      'Masala Lemonade', 'Mini Dosa', 'Bhel Puri', 'Jalebi',
    ],
  },

  'kids-party': {
    badge: 'Kid-Approved',
    tagline: 'Food that makes little ones do a happy dance',
    description:
      'Kids\' parties need special menus — small portions, familiar favourites and fun presentations. Our team creates a safe, hygienic and absolutely delicious spread that keeps the little guests happy and the parents stress-free.',
    stats: [
      { icon: '👥', label: 'Guests', value: '20–200' },
      { icon: '⏱️', label: 'Service', value: '2–4 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '4–12 persons' },
      { icon: '📅', label: 'Advance Booking', value: '2+ days' },
    ],
    features: [
      { icon: '🍕', title: 'Kids-Friendly Menu', desc: 'Pizzas, burgers, pasta and Indian snacks kids always love.' },
      { icon: '🎨', title: 'Fun Food Presentation', desc: 'Character platters, smiley faces and themed food art.' },
      { icon: '🧃', title: 'Juice & Mocktail Bar', desc: 'Fresh juices, milkshakes and fun non-alcoholic drinks.' },
      { icon: '🍰', title: 'Custom Birthday Cake', desc: 'Coordinate with us for the perfect cake to match your theme.' },
      { icon: '🛡️', title: 'Allergen Safe', desc: 'We list allergens clearly and can accommodate dietary needs.' },
      { icon: '✨', title: 'Minimal Mess Setup', desc: 'Disposable but eco-friendly service ware for easy cleanup.' },
    ],
    menuHighlights: [
      'Mini Pizzas', 'French Fries', 'Pasta', 'Mini Burgers',
      'Chocolate Cake', 'Ice Cream Cups', 'Fruit Skewers', 'Masala Corn',
    ],
  },

  'house-party': {
    badge: 'Chill & Tasty',
    tagline: 'Great food, great company — we handle the rest',
    description:
      'Hosting a house party has never been easier. Let us take over the kitchen and serving so you can enjoy the evening with your guests. Customisable menus for 15 to 150 people — from a casual dinner to a cocktail night.',
    stats: [
      { icon: '👥', label: 'Guests', value: '15–150' },
      { icon: '⏱️', label: 'Service', value: '3–5 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '3–12 persons' },
      { icon: '📅', label: 'Advance Booking', value: '2+ days' },
    ],
    features: [
      { icon: '🏠', title: 'In-Home Cooking', desc: 'Our team cooks fresh in your kitchen or brings a mobile unit.' },
      { icon: '🍻', title: 'Party Snack Stations', desc: 'Finger foods, chaat and continental bites for mingling guests.' },
      { icon: '🍽️', title: 'Full Dinner Setup', desc: 'Complete buffet setup with live counters if you prefer.' },
      { icon: '🥂', title: 'Mocktail Pairing', desc: 'Suggest drink pairings to match every course.' },
      { icon: '🧑‍🍳', title: 'Private Chef Option', desc: 'A dedicated chef stationed in your kitchen all evening.' },
      { icon: '🧹', title: 'Full Cleanup', desc: 'We leave your home as clean as we found it.' },
    ],
    menuHighlights: [
      'Pav Bhaji', 'Paneer Tikka', 'Biryani', 'Dahi Bhalla',
      'Gulab Jamun', 'Kulfi', 'Masala Soda', 'Naan & Curry',
    ],
  },

  'royal-lunch': {
    badge: 'Lavish',
    tagline: 'A truly royal dining experience',
    description:
      'Inspired by the grandeur of Mughal and Rajput courts, our Royal Lunch is a multi-course feast featuring regal slow-cooked curries, dum biryanis, kebab platters and spectacular dessert presentations.',
    stats: [
      { icon: '👥', label: 'Guests', value: '50–500' },
      { icon: '⏱️', label: 'Service', value: '3–5 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '10–40 persons' },
      { icon: '📅', label: 'Advance Booking', value: '5+ days' },
    ],
    features: [
      { icon: '👑', title: 'Dum-Cooked Specialties', desc: 'Slow-cooked biryanis, nihari and korma prepared in sealed vessels.' },
      { icon: '🥩', title: 'Live Kebab Counter', desc: 'Freshly grilled seekh, reshmi and galouti kebabs on the spot.' },
      { icon: '🌹', title: 'Rose-Water Desserts', desc: 'Shahi tukda, phirni, rasmalai and gulab-scented sweets.' },
      { icon: '🏺', title: 'Earthen Pot Presentation', desc: 'Dal, kheer and curries served in traditional clay matkas.' },
      { icon: '🥗', title: 'Royal Salad Bar', desc: 'Achaar, raita, papad and kachumber with artisanal presentation.' },
      { icon: '🎶', title: 'Cultural Ambience', desc: 'We can suggest folk music and decor vendors to complete the theme.' },
    ],
    menuHighlights: [
      'Dum Biryani', 'Nihari', 'Seekh Kebab', 'Rogan Josh',
      'Shahi Tukda', 'Rasmalai', 'Tandoori Roti', 'Dal Bukhara',
    ],
  },

  'bachelor-party': {
    badge: 'Epic Night',
    tagline: 'Send off the groom in style — and with great food',
    description:
      'A bachelor party spread that keeps the energy up all night. Bold flavours, loaded sharing platters, live grills and an impressive spread designed for a group of people who are there to have an unforgettable time.',
    stats: [
      { icon: '👥', label: 'Guests', value: '10–80' },
      { icon: '⏱️', label: 'Service', value: '4–6 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '3–15 persons' },
      { icon: '📅', label: 'Advance Booking', value: '2+ days' },
    ],
    features: [
      { icon: '🔥', title: 'Live Grill Station', desc: 'Charcoal BBQ, tikkas and kebabs cooked right in front of guests.' },
      { icon: '🍗', title: 'Sharing Platters', desc: 'Big, bold platters designed for group dining and fun.' },
      { icon: '🌶️', title: 'Bold Flavours', desc: 'Spicy, smoky and robust — food that matches the occasion energy.' },
      { icon: '🍟', title: 'Loaded Snack Bar', desc: 'Loaded fries, nachos, wings and shawarma sides.' },
      { icon: '🎮', title: 'Flexible Setup', desc: 'Works with any venue — terrace, farmhouse, club or hotel room.' },
      { icon: '🧹', title: 'Complete Service', desc: 'Setup, service and cleanup — you focus on the celebrations.' },
    ],
    menuHighlights: [
      'Mutton Tikka', 'Chicken Wings', 'Seekh Kebab', 'Loaded Fries',
      'Peri-Peri Paneer', 'Shawarma Platter', 'Mocktail Bar', 'Brownie Bites',
    ],
  },

  'no-onion-no-garlic': {
    badge: 'Sattvic',
    tagline: 'Pure, wholesome food without compromise',
    description:
      'We understand that many families prefer or require sattvic cooking — and we excel at it. Our no-onion-no-garlic menu is full of depth, flavour and variety, proving that pure food can be extraordinary food.',
    stats: [
      { icon: '👥', label: 'Guests', value: '10–500' },
      { icon: '⏱️', label: 'Service', value: 'Any Duration' },
      { icon: '👨‍🍳', label: 'Staff', value: '3–30 persons' },
      { icon: '📅', label: 'Advance Booking', value: '2+ days' },
    ],
    features: [
      { icon: '🌿', title: '100% Sattvic', desc: 'Absolutely no onion, garlic or non-veg ingredients used.' },
      { icon: '🍛', title: 'Rich Flavour Profiles', desc: 'Asafoetida, ginger and aromatic spices create exceptional taste.' },
      { icon: '🥗', title: 'Full Menu Coverage', desc: 'Starters, mains, breads, rice, desserts — a complete feast.' },
      { icon: '📋', title: 'Jain Options Available', desc: 'Root vegetable-free dishes available for Jain requirements.' },
      { icon: '✅', title: 'Separately Cooked', desc: 'Prepared with dedicated utensils, separate from any other food.' },
      { icon: '💚', title: 'Health-Conscious', desc: 'Less oil, no artificial colours — pure and clean cooking.' },
    ],
    menuHighlights: [
      'Saag Paneer', 'Matar Kofta', 'Dal Tadka', 'Jeera Aloo',
      'Halwa Puri', 'Kheer', 'Sabudana Khichdi', 'Lauki Sabzi',
    ],
  },

  'anniversary': {
    badge: 'Romantic',
    tagline: 'Celebrate your love with extraordinary cuisine',
    description:
      'Mark another year of love with an intimate and elegant dining experience. Whether it\'s a quiet dinner for two or a celebration with close family and friends, our anniversary catering is crafted to make the evening truly special.',
    stats: [
      { icon: '👥', label: 'Guests', value: '2–200' },
      { icon: '⏱️', label: 'Service', value: '3–5 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '2–15 persons' },
      { icon: '📅', label: 'Advance Booking', value: '2+ days' },
    ],
    features: [
      { icon: '🌹', title: 'Romantic Plating', desc: 'Heart-shaped garnishes, rose petals and elegant presentation.' },
      { icon: '🍾', title: 'Mocktail Pairing', desc: 'Custom mocktails paired with each course for a luxe experience.' },
      { icon: '🕯️', title: 'Candlelit Atmosphere', desc: 'We can coordinate candle and flower decor with your vendor.' },
      { icon: '🎂', title: 'Surprise Cake Service', desc: 'Coordinate a custom anniversary cake reveal with us.' },
      { icon: '🥘', title: 'Couple-Favourite Dishes', desc: 'Tell us your favourite foods and we\'ll make them perfect.' },
      { icon: '📸', title: 'Photogenic Spread', desc: 'Food styled for beautiful photos on your special day.' },
    ],
    menuHighlights: [
      'Mushroom Soup', 'Caesar Salad', 'Butter Garlic Prawns', 'Lamb Chops',
      'Chocolate Lava Cake', 'Crème Brûlée', 'Strawberry Panna Cotta', 'Rasmalai',
    ],
  },

  'baby-shower': {
    badge: 'Sweet & Gentle',
    tagline: 'Wholesome food for a beautiful new beginning',
    description:
      'Welcome the newest family member with wholesome, nourishing food. Our baby shower menus are light, fresh and beautifully presented — pastel-themed displays, healthy bites and sweet treats for mom and guests.',
    stats: [
      { icon: '👥', label: 'Guests', value: '20–150' },
      { icon: '⏱️', label: 'Service', value: '2–4 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '4–15 persons' },
      { icon: '📅', label: 'Advance Booking', value: '2+ days' },
    ],
    features: [
      { icon: '🍼', title: 'Themed Presentation', desc: 'Pastel colours, baby motifs and a beautiful dessert table.' },
      { icon: '🥗', title: 'Light & Healthy', desc: 'Nutritious, pregnancy-friendly options clearly marked.' },
      { icon: '🧁', title: 'Dessert Table', desc: 'Custom cupcakes, cake pops and a gender-reveal centrepiece.' },
      { icon: '🌿', title: 'Nutritional Focus', desc: 'Iron-rich, calcium-packed dishes good for mom-to-be.' },
      { icon: '🫖', title: 'High Tea Option', desc: 'Light sandwiches, scones and teas for an elegant afternoon.' },
      { icon: '📦', title: 'Goodie Boxes', desc: 'Mithai and snack boxes for guests to take home.' },
    ],
    menuHighlights: [
      'Fruit Platter', 'Mini Sandwiches', 'Quinoa Salad', 'Khajoor Ladoo',
      'Customised Cake', 'Fruit Punch', 'Kaju Katli', 'Dry Fruit Bites',
    ],
  },

  'continental-food': {
    badge: 'Global Flavours',
    tagline: 'World-class cuisine crafted with Indian warmth',
    description:
      'Bring the world to your table with our continental catering. From Italian pasta stations to French-inspired soups, grilled vegetables and signature desserts — all prepared by trained chefs with international experience.',
    stats: [
      { icon: '👥', label: 'Guests', value: '50–1000' },
      { icon: '⏱️', label: 'Service', value: '3–6 hours' },
      { icon: '👨‍🍳', label: 'Staff', value: '8–40 persons' },
      { icon: '📅', label: 'Advance Booking', value: '5+ days' },
    ],
    features: [
      { icon: '🍝', title: 'Live Pasta Station', desc: 'Freshly tossed pasta in your choice of sauce, cooked to order.' },
      { icon: '🥗', title: 'International Salad Bar', desc: 'Caesar, Greek, Niçoise and more dressing options.' },
      { icon: '🥩', title: 'Grill & Carving Counter', desc: 'Live grilling and carving station for a theatrical touch.' },
      { icon: '🍰', title: 'Patisserie Desserts', desc: 'Tarts, mousses, éclairs and pastries from trained pâtissiers.' },
      { icon: '🍜', title: 'Fusion Options', desc: 'Indo-Continental dishes that bridge the two worlds beautifully.' },
      { icon: '🌍', title: 'Global Beverages', desc: 'Italian soda, mocktails, herbal infusions and cold brews.' },
    ],
    menuHighlights: [
      'Minestrone Soup', 'Pasta Arrabiata', 'Grilled Chicken', 'Veg Au Gratin',
      'Garlic Bread', 'Tiramisu', 'Panna Cotta', 'Bruschetta',
    ],
  },

  'other-occasion': {
    badge: 'Custom',
    tagline: 'Every celebration deserves exceptional food',
    description:
      'Have a unique event in mind? We cater to every occasion — from religious ceremonies to retirement parties, community events and everything in between. Share your vision and we\'ll create a menu and service plan that fits perfectly.',
    stats: [
      { icon: '👥', label: 'Guests', value: 'Any Size' },
      { icon: '⏱️', label: 'Service', value: 'Flexible' },
      { icon: '👨‍🍳', label: 'Staff', value: 'As Required' },
      { icon: '📅', label: 'Advance Booking', value: '3+ days' },
    ],
    features: [
      { icon: '✏️', title: 'Fully Customisable', desc: 'Menu, service style, timing — everything built around you.' },
      { icon: '🤝', title: 'Free Consultation', desc: 'Speak with our event specialist to plan the perfect experience.' },
      { icon: '💰', title: 'Flexible Budgets', desc: 'Packages starting from ₹149/plate for any group size.' },
      { icon: '📍', title: 'Any Location', desc: 'Home, community hall, venue or outdoor — we come to you.' },
      { icon: '🗓️', title: 'Last-Minute Bookings', desc: 'We try our best to accommodate even short-notice requests.' },
      { icon: '⭐', title: '4.9 Google Rating', desc: '10,000+ happy families trust The Famous Halwai.' },
    ],
    menuHighlights: [
      'Custom Menu', 'Regional Cuisine', 'Live Counters', 'Dessert Spread',
      'Beverage Station', 'Snack Platters', 'Full Meal Service', 'Mithai Box',
    ],
  },
};

/** Fallback for any slug not explicitly listed */
export const getFallbackData = (name = '') => ({
  badge: 'Catering',
  tagline: `Perfect food for your ${name}`,
  description: `The Famous Halwai brings authentic, delicious catering to your ${name}. Our verified professionals craft customised menus, handle the full setup and ensure your guests leave with happy hearts and satisfied appetites.`,
  stats: [
    { icon: '👥', label: 'Guests', value: '20–500' },
    { icon: '⏱️', label: 'Service', value: '3–6 hours' },
    { icon: '👨‍🍳', label: 'Staff', value: '5–30 persons' },
    { icon: '📅', label: 'Advance Booking', value: '3+ days' },
  ],
  features: [
    { icon: '🍽️', title: 'Custom Menu', desc: 'A menu designed specifically for your occasion and preferences.' },
    { icon: '🧑‍🍳', title: 'Expert Chefs', desc: 'Trained, background-verified professionals for your event.' },
    { icon: '✨', title: 'Elegant Setup', desc: 'Professional service ware, chafing dishes and full setup.' },
    { icon: '🌿', title: 'Veg & Non-Veg', desc: 'Comprehensive choices covering all dietary preferences.' },
    { icon: '⏰', title: 'Timely Service', desc: 'We start and finish on schedule — always.' },
    { icon: '🧹', title: 'Post-Event Cleanup', desc: 'We leave the venue clean after the event is done.' },
  ],
  menuHighlights: ['Dal Makhani', 'Paneer Tikka', 'Biryani', 'Gulab Jamun', 'Chaat Counter', 'Fresh Rotis'],
});
