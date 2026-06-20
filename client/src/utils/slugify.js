/**
 * Converts a display name to a URL-friendly slug.
 * e.g. "Cocktail & Sangeet" → "cocktail-sangeet"
 */
export const slugify = (str = '') =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
