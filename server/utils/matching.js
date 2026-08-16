/**
 * Normalizes a shoe name to extract the core model name.
 * For example: "Nike Air Max 270 Men's Running Shoes" -> "air max 270"
 */
export function normalizeModelName(brand, name) {
  if (!name) return '';
  let clean = name.toLowerCase();
  
  const brandLower = brand.toLowerCase();
  // Remove brand prefix if present
  if (clean.startsWith(brandLower)) {
    clean = clean.substring(brandLower.length).trim();
  }
  
  // Remove noisy keywords that vary across store product names
  const noisePatterns = [
    /\bmen's\b/g,
    /\bwomen's\b/g,
    /\bunisex\b/g,
    /\bkids'\b/g,
    /\byouth\b/g,
    /\brunning shoes\b/g,
    /\bshoes\b/g,
    /\bsneakers\b/g,
    /\bclassic\b/g,
    /\bcasual\b/g,
    /\btennis\b/g,
    /\blifestyle\b/g,
    /\btraining\b/g,
    /\bactive\b/g,
    / - original$/g
  ];
  
  noisePatterns.forEach(pattern => {
    clean = clean.replace(pattern, '');
  });
  
  // Clean up duplicate spaces and trim
  clean = clean.replace(/\s+/g, ' ').trim();
  
  return clean;
}

/**
 * Returns a standardized slug for a product based on its brand and model name
 */
export function generateProductSlug(brand, name) {
  const normalizedModel = normalizeModelName(brand, name);
  return `${brand.toLowerCase()}-${normalizedModel.replace(/\s+/g, '-')}`.replace(/[^a-z0-9-]/g, '');
}

/**
 * Checks if two products represent the same shoe model
 */
export function areProductsMatching(brandA, nameA, brandB, nameB) {
  if (brandA.toLowerCase() !== brandB.toLowerCase()) {
    return false;
  }
  const modelA = normalizeModelName(brandA, nameA);
  const modelB = normalizeModelName(brandB, nameB);
  
  // A match exists if they resolve to the exact same normalized model,
  // or if one normalized model name contains the other (e.g. "air max 270 react" vs "air max 270")
  return modelA === modelB || (modelA.length > 3 && modelB.length > 3 && (modelA.includes(modelB) || modelB.includes(modelA)));
}
