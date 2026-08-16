import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { normalizeModelName } from './utils/matching.js';
import { calculateBestDeal, calculateDealScore } from './utils/algorithms.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/soledeal';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('API will run in Mock Fallback mode if DB is not reachable.');
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

/**
 * Group listings by SKU (shoe model) and format the consolidated product
 */
function groupListingsToShoes(listings) {
  const groups = {};
  
  // Group by SKU
  listings.forEach(listing => {
    if (!groups[listing.sku]) {
      groups[listing.sku] = [];
    }
    groups[listing.sku].push(listing);
  });

  const shoes = [];
  
  Object.keys(groups).forEach(sku => {
    const groupListings = groups[sku];
    const first = groupListings[0];
    
    // Calculate deal scores for all listings in this group in context of each other
    const listingsWithScores = groupListings.map(item => {
      const plainObj = item.toObject ? item.toObject() : item;
      return {
        ...plainObj,
        dealScore: calculateDealScore(plainObj, groupListings)
      };
    });

    // Find the best deal
    const bestDeal = calculateBestDeal(listingsWithScores);
    
    // Find min and max price in the group
    const prices = listingsWithScores.map(l => l.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    shoes.push({
      sku: sku,
      brand: first.brand,
      name: first.name,
      model: first.model,
      image: first.image,
      category: first.category,
      gender: first.gender,
      sizes: first.sizes,
      originalPrice: first.originalPrice,
      priceRange: { min: minPrice, max: maxPrice },
      bestDeal: bestDeal,
      dealScore: bestDeal.dealScore,
      rating: first.rating, // representative product rating
      listingsCount: groupListings.length,
      listings: listingsWithScores.sort((a, b) => a.price - b.price), // Sort listings by price
      lastUpdated: first.lastUpdated
    });
  });

  return shoes;
}

/**
 * GET /api/products
 * Query parameters: brand, size, gender, category, priceMin, priceMax, store, discountMin, sort, q
 */
app.get('/api/products', async (req, res) => {
  try {
    const { brand, size, gender, category, priceMin, priceMax, store, discountMin, sort, q } = req.query;
    
    // Build query filters for individual store listings
    const query = {};

    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }
    if (gender) {
      query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
    }
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (size) {
      query.sizes = Number(size);
    }
    if (store) {
      query.store = { $regex: new RegExp(`^${store}$`, 'i') };
    }
    if (discountMin) {
      query.discount = { $gte: Number(discountMin) };
    }
    
    // Price range filters
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // Text search query
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { model: searchRegex },
        { category: searchRegex }
      ];
    }

    // Fetch matching listings
    let listings = [];
    if (mongoose.connection.readyState === 1) {
      listings = await Product.find(query);
    } else {
      // Fallback message if DB is down, frontend will handle local fallback
      return res.status(503).json({ error: 'Database unavailable' });
    }

    // Group listings to unique shoes
    let shoes = groupListingsToShoes(listings);

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'lowestPrice':
          shoes.sort((a, b) => a.bestDeal.price - b.bestDeal.price);
          break;
        case 'highestDiscount':
          shoes.sort((a, b) => b.bestDeal.discount - a.bestDeal.discount);
          break;
        case 'rating':
          shoes.sort((a, b) => b.rating - a.rating);
          break;
        case 'bestDeal':
        default:
          shoes.sort((a, b) => b.dealScore - a.dealScore);
          break;
      }
    } else {
      // Default: best deal score descending
      shoes.sort((a, b) => b.dealScore - a.dealScore);
    }

    res.json(shoes);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/products/:sku
 * Get full price comparison details for a single shoe model
 */
app.get('/api/products/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const listings = await Product.find({ sku: sku });
    
    if (!listings || listings.length === 0) {
      return res.status(404).json({ error: 'Shoe model not found' });
    }

    const grouped = groupListingsToShoes(listings);
    const shoe = grouped[0];

    // Generate custom price history points for visual chart
    const minPrice = shoe.bestDeal.price;
    const origPrice = shoe.originalPrice;
    
    // Synthesize history data (e.g. over past 4 months)
    shoe.priceHistory = [
      { date: 'May', price: origPrice },
      { date: 'Jun', price: Math.round(origPrice * 0.95) },
      { date: 'Jul', price: Math.round(minPrice * 1.15) },
      { date: 'Aug', price: minPrice }
    ];

    res.json(shoe);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/deals
 * Quick endpoint to get top 6 deals with the highest discounts/deal scores
 */
app.get('/api/deals', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const listings = await Product.find({});
    const shoes = groupListingsToShoes(listings);
    
    // Sort by discount descending and take top 6
    const topDeals = shoes
      .sort((a, b) => b.bestDeal.discount - a.bestDeal.discount)
      .slice(0, 6);

    res.json(topDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`SoleDeal API Server listening on port ${PORT}`);
});
