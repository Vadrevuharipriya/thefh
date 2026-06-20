import { cities } from './homeData.js';
import { cityPageData } from './cityData.js';
import { slugify } from './slugify.js';

const missing = [];
for (const city of cities) {
  const slug = slugify(city.name);
  if (!cityPageData[slug]) {
    missing.push(`${city.name} (${slug})`);
  }
}
if (missing.length === 0) {
  console.log('All cities have cityPageData entries.');
} else {
  console.log('Missing cityPageData for:', missing.join(', '));
}
