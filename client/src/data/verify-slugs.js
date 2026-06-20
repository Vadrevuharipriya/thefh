import { cityPageData } from './cityData.js';
const expectedSlugs = [
  'delhi-ncr','dehradun','haridwar','faridabad','rishikesh','lucknow','jaipur',
  'tehri-garhwal','gurugram','ghaziabad','yamunanagar','chandigarh','saharanpur',
  'agra','bihar','himachal-pradesh','kolkata','maharashtra','punjab','karnal'
];
const missing = expectedSlugs.filter(s => !cityPageData[s]);
console.log('Missing:', missing);
console.log('Total expected:', expectedSlugs.length, 'Found:', expectedSlugs.length - missing.length);
