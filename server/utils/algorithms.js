/**
 * Calculates the deal score for a product listing.
 * Score is out of 100.
 * Factors:
 * 1. Discount percentage (up to 30 points)
 * 2. Price positioning compared to other stores (up to 40 points)
 * 3. Delivery fee (up to 15 points)
 * 4. Store rating (up to 15 points)
 */
export function calculateDealScore(product, siblingListings = []) {
  const { price, originalPrice, discount, deliveryFee, rating } = product;

  // 1. Discount score (Max 30 points)
  // Max score at 50% discount or higher
  const discountScore = Math.min((discount / 50) * 30, 30);

  // 2. Price positioning score (Max 40 points)
  let priceScore = 20; // Default baseline if single store
  if (siblingListings.length > 1) {
    const prices = siblingListings.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (maxPrice > minPrice) {
      // 40 points if it is the cheapest, scaling down to 0 if it is the most expensive
      priceScore = 40 * (1 - (price - minPrice) / (maxPrice - minPrice));
    } else {
      priceScore = 40; // All stores have same price
    }
  } else {
    // If only one store exists, base it on the discount size
    priceScore = 20 + Math.min((discount / 50) * 20, 20);
  }

  // 3. Delivery score (Max 15 points)
  // Free delivery gets 15 points. Deduct 1 point for every ₹10 of delivery fee.
  const deliveryScore = Math.max(15 - (deliveryFee / 10), 0);

  // 4. Rating score (Max 15 points)
  // Rating is out of 5. scale to 15 points.
  const ratingScore = (rating / 5) * 15;

  const totalScore = Math.round(discountScore + priceScore + deliveryScore + ratingScore);
  
  // Bound between 10 and 100
  return Math.max(10, Math.min(100, totalScore));
}

/**
 * Categorizes a deal score into user-friendly text and color schemes
 */
export function getDealScoreCategory(score) {
  if (score >= 90) return { label: 'Excellent Deal', color: 'text-green-400 bg-green-500/10 border-green-500/35' };
  if (score >= 75) return { label: 'Great Deal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/35' };
  if (score >= 60) return { label: 'Good Deal', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/35' };
  if (score >= 45) return { label: 'Fair Deal', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/35' };
  return { label: 'Average Deal', color: 'text-slate-400 bg-slate-500/10 border-slate-500/35' };
}

/**
 * Calculates and returns the best deal listing from an array of listings for the same shoe
 */
export function calculateBestDeal(listings) {
  if (!listings || listings.length === 0) return null;
  if (listings.length === 1) return listings[0];

  // Calculate scores for all listings in context of each other
  const listingsWithScores = listings.map(l => ({
    ...l,
    dealScore: calculateDealScore(l, listings)
  }));

  // Sort by Deal Score descending. If scores are equal, sort by price ascending.
  listingsWithScores.sort((a, b) => {
    if (b.dealScore !== a.dealScore) {
      return b.dealScore - a.dealScore;
    }
    // Secondary sort: total cost (price + delivery fee)
    return (a.price + a.deliveryFee) - (b.price + b.deliveryFee);
  });

  return listingsWithScores[0];
}
