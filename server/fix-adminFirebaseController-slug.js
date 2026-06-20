const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'controllers', 'adminFirebaseController.js');
const text = fs.readFileSync(filePath, 'utf8');
const start = text.indexOf('if (!chefData.slug)');
const end = text.indexOf('if (existing)', start);
if (start === -1 || end === -1) {
  throw new Error('Unable to find slug generation block markers.');
}
const replacement = `  if (!chefData.slug) {
    const baseSlug = firebaseChef.name
      ? firebaseChef.name.toString().trim().toLowerCase().replace(/[^\\w\\s-]/g, '').replace(/[\\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      : \\`chef-${firebaseId.slice(0, 5)}\\`;
    chefData.slug = \\`$\{baseSlug}-$\{firebaseId.slice(0, 5)}\\`;
  }\r\n`;
const newText = text.slice(0, start) + replacement + text.slice(end);
fs.writeFileSync(filePath, newText, 'utf8');
console.log('Updated slug generation block successfully.');
