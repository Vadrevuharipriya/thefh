const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'controllers', 'adminFirebaseController.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
const start = lines.findIndex((l) => l.trim() === 'if (!chefData.slug) {');
if (start < 0) {
  throw new Error('Start line not found');
}
const end = lines.findIndex((l, i) => i > start && l.trim() === '}' && lines[i + 1] && lines[i + 1].includes('if (existing)'));
if (end < 0) {
  throw new Error('End line not found');
}
const replacement = [
  '  if (!chefData.slug) {',
  '    const baseSlug = firebaseChef.name',
  "      ? firebaseChef.name.toString().trim().toLowerCase().replace(/[^\\w\\s-]/g, '').replace(/[\\s_-]+/g, '-').replace(/^-+|-+$/g, '')",
  '      : `chef-${firebaseId.slice(0, 5)}`;',
  '    chefData.slug = `${baseSlug}-${firebaseId.slice(0, 5)}`;',
  '  }',
];
lines.splice(start, end - start + 1, ...replacement);
fs.writeFileSync(filePath, lines.join('\r\n'), 'utf8');
console.log('repair completed');
