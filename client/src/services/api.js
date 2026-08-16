// API service to connect with Express backend
// Falls back to local client-side processing if the backend is down or not configured

const API_BASE_URL = 'http://localhost:5000/api';

// Realistic mock database for client-side fallback
const mockShoesData = [
  {
    brand: 'Nike',
    name: "Nike Air Max 270 Men's Running Shoes",
    model: 'Air Max 270',
    category: 'Running',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60',
    originalPrice: 12995,
    sku: 'nike-air-max-270',
    sizes: [7, 8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 7999, discount: 38, deliveryFee: 0, rating: 4.8, productUrl: 'https://example.com/nike-am270-solestore' },
      { store: 'FootPulse', price: 8499, discount: 35, deliveryFee: 49, rating: 4.5, productUrl: 'https://example.com/nike-am270-footpulse' },
      { store: 'SneakerSphere', price: 9199, discount: 29, deliveryFee: 0, rating: 4.2, productUrl: 'https://example.com/nike-am270-sneakersphere' }
    ]
  },
  {
    brand: 'Nike',
    name: 'Nike Dunk Low Retro',
    model: 'Dunk Low',
    category: 'Sneakers',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=60',
    originalPrice: 8295,
    sku: 'nike-dunk-low',
    sizes: [6, 7, 8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 7499, discount: 10, deliveryFee: 99, rating: 4.7, productUrl: 'https://example.com/nike-dunk-solestore' },
      { store: 'FootPulse', price: 6999, discount: 16, deliveryFee: 0, rating: 4.4, productUrl: 'https://example.com/nike-dunk-footpulse' },
      { store: 'FitWay', price: 7299, discount: 12, deliveryFee: 49, productUrl: 'https://example.com/nike-dunk-fitway', rating: 4.1 }
    ]
  },
  {
    brand: 'Nike',
    name: 'Nike Air Force 1 \'07',
    model: 'Air Force 1',
    category: 'Sneakers',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60',
    originalPrice: 9695,
    sku: 'nike-air-force-1',
    sizes: [8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 8999, discount: 7, deliveryFee: 0, rating: 4.9, productUrl: 'https://example.com/nike-af1-solestore' },
      { store: 'SneakerSphere', price: 8499, discount: 12, deliveryFee: 99, rating: 4.3, productUrl: 'https://example.com/nike-af1-sneakersphere' },
      { store: 'FootPulse', price: 8799, discount: 9, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/nike-af1-footpulse' }
    ]
  },
  {
    brand: 'Nike',
    name: 'Nike Pegasus 40 Road Running',
    model: 'Pegasus 40',
    category: 'Running',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1512374382149-4332c6c02153?w=600&auto=format&fit=crop&q=60',
    originalPrice: 11495,
    sku: 'nike-pegasus-40',
    sizes: [5, 6, 7, 8],
    listings: [
      { store: 'FootPulse', price: 8999, discount: 22, deliveryFee: 0, rating: 4.5, productUrl: 'https://example.com/nike-peg40-footpulse' },
      { store: 'SoleStore', price: 9299, discount: 19, deliveryFee: 0, rating: 4.8, productUrl: 'https://example.com/nike-peg40-solestore' },
      { store: 'FitWay', price: 8599, discount: 25, deliveryFee: 149, rating: 3.9, productUrl: 'https://example.com/nike-peg40-fitway' }
    ]
  },
  {
    brand: 'Adidas',
    name: 'Adidas Ultraboost 22 Shoes',
    model: 'Ultraboost 22',
    category: 'Running',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=60',
    originalPrice: 18999,
    sku: 'adidas-ultraboost-22',
    sizes: [7, 8, 9, 10, 11, 12],
    listings: [
      { store: 'SoleStore', price: 11999, discount: 37, deliveryFee: 0, rating: 4.7, productUrl: 'https://example.com/adi-ub22-solestore' },
      { store: 'FootPulse', price: 12499, discount: 34, deliveryFee: 99, rating: 4.6, productUrl: 'https://example.com/adi-ub22-footpulse' },
      { store: 'FitWay', price: 11299, discount: 41, deliveryFee: 149, rating: 4.2, productUrl: 'https://example.com/adi-ub22-fitway' }
    ]
  },
  {
    brand: 'Adidas',
    name: 'Adidas Stan Smith Sneakers',
    model: 'Stan Smith',
    category: 'Classic',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=60',
    originalPrice: 8999,
    sku: 'adidas-stan-smith',
    sizes: [6, 7, 8, 9, 10],
    listings: [
      { store: 'SoleStore', price: 5999, discount: 33, deliveryFee: 0, rating: 4.5, productUrl: 'https://example.com/adi-stan-solestore' },
      { store: 'SneakerSphere', price: 5499, discount: 39, deliveryFee: 49, rating: 4.3, productUrl: 'https://example.com/adi-stan-sneakersphere' },
      { store: 'FitWay', price: 5199, discount: 42, deliveryFee: 99, rating: 4.0, productUrl: 'https://example.com/adi-stan-fitway' }
    ]
  },
  {
    brand: 'Adidas',
    name: 'Adidas NMD_R1 V2 Shoes',
    model: 'NMD_R1',
    category: 'Sneakers',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=60',
    originalPrice: 12999,
    sku: 'adidas-nmd-r1',
    sizes: [8, 9, 10, 11],
    listings: [
      { store: 'FootPulse', price: 8999, discount: 31, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/adi-nmd-footpulse' },
      { store: 'SoleStore', price: 9299, discount: 28, deliveryFee: 0, rating: 4.8, productUrl: 'https://example.com/adi-nmd-solestore' },
      { store: 'SneakerSphere', price: 8799, discount: 32, deliveryFee: 49, rating: 4.2, productUrl: 'https://example.com/adi-nmd-sneakersphere' }
    ]
  },
  {
    brand: 'Adidas',
    name: 'Adidas Samba OG Shoes',
    model: 'Samba OG',
    category: 'Classic',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=60',
    originalPrice: 10999,
    sku: 'adidas-samba-og',
    sizes: [6, 7, 8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 9999, discount: 9, deliveryFee: 0, rating: 4.8, productUrl: 'https://example.com/adi-samba-solestore' },
      { store: 'SneakerSphere', price: 9499, discount: 14, deliveryFee: 99, rating: 4.4, productUrl: 'https://example.com/adi-samba-sneakersphere' },
      { store: 'FootPulse', price: 9899, discount: 10, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/adi-samba-footpulse' }
    ]
  },
  {
    brand: 'Puma',
    name: 'Puma Suede Classic Sneaker',
    model: 'Suede Classic',
    category: 'Classic',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=60',
    originalPrice: 6999,
    sku: 'puma-suede-classic',
    sizes: [6, 7, 8, 9, 10],
    listings: [
      { store: 'SoleStore', price: 4199, discount: 40, deliveryFee: 0, rating: 4.4, productUrl: 'https://example.com/puma-suede-solestore' },
      { store: 'SneakerSphere', price: 3999, discount: 43, deliveryFee: 99, rating: 4.1, productUrl: 'https://example.com/puma-suede-sneakersphere' },
      { store: 'FitWay', price: 4499, discount: 36, deliveryFee: 0, rating: 4.3, productUrl: 'https://example.com/puma-suede-fitway' }
    ]
  },
  {
    brand: 'Puma',
    name: 'Puma RS-X Geek Sneakers',
    model: 'RS-X',
    category: 'Sneakers',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=60',
    originalPrice: 9999,
    sku: 'puma-rs-x',
    sizes: [7, 8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 5999, discount: 40, deliveryFee: 0, rating: 4.7, productUrl: 'https://example.com/puma-rsx-solestore' },
      { store: 'FootPulse', price: 6299, discount: 37, deliveryFee: 49, rating: 4.5, productUrl: 'https://example.com/puma-rsx-footpulse' },
      { store: 'SneakerSphere', price: 5699, discount: 43, deliveryFee: 99, rating: 4.2, productUrl: 'https://example.com/puma-rsx-sneakersphere' }
    ]
  },
  {
    brand: 'Puma',
    name: 'Puma Velocity Nitro 2 Running',
    model: 'Velocity Nitro 2',
    category: 'Running',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=60',
    originalPrice: 11999,
    sku: 'puma-velocity-nitro',
    sizes: [8, 9, 10, 11],
    listings: [
      { store: 'FootPulse', price: 7999, discount: 33, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/puma-nitro-footpulse' },
      { store: 'FitWay', price: 7199, discount: 40, deliveryFee: 149, rating: 4.1, productUrl: 'https://example.com/puma-nitro-fitway' },
      { store: 'SoleStore', price: 7799, discount: 35, deliveryFee: 0, rating: 4.7, productUrl: 'https://example.com/puma-nitro-solestore' }
    ]
  },
  {
    brand: 'New Balance',
    name: 'New Balance 574 Core Classic',
    model: '574',
    category: 'Classic',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=60',
    originalPrice: 7999,
    sku: 'nb-574',
    sizes: [6, 7, 8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 5599, discount: 30, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/nb-574-solestore' },
      { store: 'SneakerSphere', price: 5199, discount: 35, deliveryFee: 79, rating: 4.3, productUrl: 'https://example.com/nb-574-sneakersphere' },
      { store: 'FootPulse', price: 5499, discount: 31, deliveryFee: 0, rating: 4.5, productUrl: 'https://example.com/nb-574-footpulse' }
    ]
  },
  {
    brand: 'New Balance',
    name: 'New Balance 990v6 Made in USA',
    model: '990v6',
    category: 'Classic',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=60',
    originalPrice: 22999,
    sku: 'nb-990v6',
    sizes: [8, 9, 10, 11, 12],
    listings: [
      { store: 'SoleStore', price: 18999, discount: 17, deliveryFee: 0, rating: 4.9, productUrl: 'https://example.com/nb-990-solestore' },
      { store: 'FootPulse', price: 19499, discount: 15, deliveryFee: 0, rating: 4.7, productUrl: 'https://example.com/nb-990-footpulse' },
      { store: 'SneakerSphere', price: 18299, discount: 20, deliveryFee: 199, rating: 4.4, productUrl: 'https://example.com/nb-990-sneakersphere' }
    ]
  },
  {
    brand: 'New Balance',
    name: 'New Balance Fresh Foam X 1080v12',
    model: 'Fresh Foam 1080v12',
    category: 'Running',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddff0bc2?w=600&auto=format&fit=crop&q=60',
    originalPrice: 14999,
    sku: 'nb-1080v12',
    sizes: [6, 7, 8, 9],
    listings: [
      { store: 'FootPulse', price: 10999, discount: 27, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/nb-1080-footpulse' },
      { store: 'SoleStore', price: 11499, discount: 23, deliveryFee: 0, rating: 4.8, productUrl: 'https://example.com/nb-1080-solestore' },
      { store: 'FitWay', price: 10499, discount: 30, deliveryFee: 149, rating: 4.1, productUrl: 'https://example.com/nb-1080-fitway' }
    ]
  },
  {
    brand: 'ASICS',
    name: 'ASICS Gel-Kayano 30 Running Shoes',
    model: 'Gel-Kayano 30',
    category: 'Running',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&auto=format&fit=crop&q=60',
    originalPrice: 15999,
    sku: 'asics-gel-kayano-30',
    sizes: [7, 8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 12999, discount: 19, deliveryFee: 0, rating: 4.8, productUrl: 'https://example.com/asics-gk30-solestore' },
      { store: 'FootPulse', price: 13499, discount: 16, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/asics-gk30-footpulse' },
      { store: 'FitWay', price: 12199, discount: 24, deliveryFee: 149, rating: 4.2, productUrl: 'https://example.com/asics-gk30-fitway' }
    ]
  },
  {
    brand: 'ASICS',
    name: 'ASICS Gel-Nimbus 25 Performance',
    model: 'Gel-Nimbus 25',
    category: 'Running',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=60',
    originalPrice: 14999,
    sku: 'asics-gel-nimbus-25',
    sizes: [6, 7, 8, 9],
    listings: [
      { store: 'FootPulse', price: 11499, discount: 23, deliveryFee: 0, rating: 4.7, productUrl: 'https://example.com/asics-gn25-footpulse' },
      { store: 'SoleStore', price: 11999, discount: 20, deliveryFee: 0, rating: 4.9, productUrl: 'https://example.com/asics-gn25-solestore' },
      { store: 'SneakerSphere', price: 10999, discount: 27, deliveryFee: 99, rating: 4.4, productUrl: 'https://example.com/asics-gn25-sneakersphere' }
    ]
  },
  {
    brand: 'Reebok',
    name: 'Reebok Club C 85 Vintage',
    model: 'Club C 85',
    category: 'Classic',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60',
    originalPrice: 6999,
    sku: 'reebok-club-c-85',
    sizes: [6, 7, 8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 4499, discount: 36, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/rbk-clubc-solestore' },
      { store: 'SneakerSphere', price: 4199, discount: 40, deliveryFee: 49, rating: 4.2, productUrl: 'https://example.com/rbk-clubc-sneakersphere' },
      { store: 'FitWay', price: 3999, discount: 43, deliveryFee: 99, rating: 4.0, productUrl: 'https://example.com/rbk-clubc-fitway' }
    ]
  },
  {
    brand: 'Reebok',
    name: 'Reebok Nano X3 Training Shoes',
    model: 'Nano X3',
    category: 'Training',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1512374382149-4332c6c02153?w=600&auto=format&fit=crop&q=60',
    originalPrice: 11999,
    sku: 'reebok-nano-x3',
    sizes: [8, 9, 10, 11],
    listings: [
      { store: 'FootPulse', price: 7999, discount: 33, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/rbk-nano-footpulse' },
      { store: 'SoleStore', price: 8499, discount: 29, deliveryFee: 0, rating: 4.7, productUrl: 'https://example.com/rbk-nano-solestore' },
      { store: 'SneakerSphere', price: 7599, discount: 37, deliveryFee: 149, rating: 4.1, productUrl: 'https://example.com/rbk-nano-sneakersphere' }
    ]
  },
  {
    brand: 'Skechers',
    name: 'Skechers Go Run Razor 4',
    model: 'Go Run Razor 4',
    category: 'Running',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60',
    originalPrice: 9999,
    sku: 'skechers-razor-4',
    sizes: [7, 8, 9, 10, 11],
    listings: [
      { store: 'SoleStore', price: 6999, discount: 30, deliveryFee: 0, rating: 4.4, productUrl: 'https://example.com/skx-razor-solestore' },
      { store: 'FootPulse', price: 7299, discount: 27, deliveryFee: 49, rating: 4.2, productUrl: 'https://example.com/skx-razor-footpulse' },
      { store: 'FitWay', price: 6499, discount: 35, deliveryFee: 99, rating: 3.9, productUrl: 'https://example.com/skx-razor-fitway' }
    ]
  },
  {
    brand: 'Skechers',
    name: 'Skechers Arch Fit Walk Shoes',
    model: 'Arch Fit',
    category: 'Classic',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddff0bc2?w=600&auto=format&fit=crop&q=60',
    originalPrice: 7499,
    sku: 'skechers-arch-fit',
    sizes: [5, 6, 7, 8],
    listings: [
      { store: 'FootPulse', price: 4999, discount: 33, deliveryFee: 0, rating: 4.6, productUrl: 'https://example.com/skx-arch-footpulse' },
      { store: 'SoleStore', price: 5299, discount: 29, deliveryFee: 0, rating: 4.7, productUrl: 'https://example.com/skx-arch-solestore' },
      { store: 'SneakerSphere', price: 4799, discount: 36, deliveryFee: 79, rating: 4.1, productUrl: 'https://example.com/skx-arch-sneakersphere' }
    ]
  }
];

// Helper to calculate Deal Score for mock listings
function calculateMockDealScore(item, allItems) {
  const discountScore = Math.min((item.discount / 50) * 30, 30);
  
  let priceScore = 20;
  if (allItems.length > 1) {
    const prices = allItems.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (maxPrice > minPrice) {
      priceScore = 40 * (1 - (item.price - minPrice) / (maxPrice - minPrice));
    } else {
      priceScore = 40;
    }
  } else {
    priceScore = 20 + Math.min((item.discount / 50) * 20, 20);
  }
  
  const deliveryScore = Math.max(15 - (item.deliveryFee / 10), 0);
  const ratingScore = (item.rating / 5) * 15;
  
  return Math.max(10, Math.min(100, Math.round(discountScore + priceScore + deliveryScore + ratingScore)));
}

// Convert raw mock data to the grouped shoe objects (matching API structure)
function getMockShoesGrouped() {
  return mockShoesData.map(shoe => {
    // Add deal scores to listings
    const listingsWithScores = shoe.listings.map(item => ({
      ...item,
      originalPrice: shoe.originalPrice,
      dealScore: calculateMockDealScore(item, shoe.listings)
    }));

    // Find the best deal (highest deal score)
    const sortedListings = [...listingsWithScores].sort((a, b) => {
      if (b.dealScore !== a.dealScore) {
        return b.dealScore - a.dealScore;
      }
      return (a.price + a.deliveryFee) - (b.price + b.deliveryFee);
    });
    
    const bestDeal = sortedListings[0];
    const prices = shoe.listings.map(l => l.price);

    return {
      sku: shoe.sku,
      brand: shoe.brand,
      name: shoe.name,
      model: shoe.model,
      image: shoe.image,
      category: shoe.category,
      gender: shoe.gender,
      sizes: shoe.sizes,
      originalPrice: shoe.originalPrice,
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
      bestDeal: bestDeal,
      dealScore: bestDeal.dealScore,
      rating: bestDeal.rating,
      listingsCount: shoe.listings.length,
      listings: listingsWithScores.sort((a, b) => a.price - b.price),
      lastUpdated: new Date()
    };
  });
}

// Local mock client-side implementation of endpoints
const localMockApi = {
  getProducts: async (filters = {}) => {
    let shoes = getMockShoesGrouped();
    const { brand, size, gender, category, priceMin, priceMax, store, discountMin, sort, q } = filters;

    // Apply filtering
    if (brand) {
      shoes = shoes.filter(s => s.brand.toLowerCase() === brand.toLowerCase());
    }
    if (gender) {
      shoes = shoes.filter(s => s.gender.toLowerCase() === gender.toLowerCase());
    }
    if (category) {
      shoes = shoes.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    if (size) {
      shoes = shoes.filter(s => s.sizes.includes(Number(size)));
    }
    if (store) {
      shoes = shoes.filter(s => s.listings.some(l => l.store.toLowerCase() === store.toLowerCase()));
    }
    if (discountMin) {
      shoes = shoes.filter(s => s.bestDeal.discount >= Number(discountMin));
    }
    if (priceMin || priceMax) {
      shoes = shoes.filter(s => {
        const price = s.bestDeal.price;
        if (priceMin && price < Number(priceMin)) return false;
        if (priceMax && price > Number(priceMax)) return false;
        return true;
      });
    }
    if (q && q.trim()) {
      const search = q.trim().toLowerCase();
      shoes = shoes.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.brand.toLowerCase().includes(search) ||
        s.model.toLowerCase().includes(search) ||
        s.category.toLowerCase().includes(search)
      );
    }

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
      shoes.sort((a, b) => b.dealScore - a.dealScore);
    }

    return shoes;
  },

  getProductDetails: async (sku) => {
    const shoes = getMockShoesGrouped();
    const shoe = shoes.find(s => s.sku === sku);
    if (!shoe) throw new Error('Product not found');

    // Add synthesized price history
    shoe.priceHistory = [
      { date: 'May', price: shoe.originalPrice },
      { date: 'Jun', price: Math.round(shoe.originalPrice * 0.95) },
      { date: 'Jul', price: Math.round(shoe.bestDeal.price * 1.15) },
      { date: 'Aug', price: shoe.bestDeal.price }
    ];

    return shoe;
  },

  getDeals: async () => {
    const shoes = getMockShoesGrouped();
    return shoes.sort((a, b) => b.bestDeal.discount - a.bestDeal.discount).slice(0, 6);
  }
};

// Exported public API client
export const api = {
  isMocked: false,

  getProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
      if (!response.ok) throw new Error('API response not ok');
      const data = await response.json();
      api.isMocked = false;
      return data;
    } catch (error) {
      console.warn('SoleDeal API connection failed. Falling back to local Mock database.', error);
      api.isMocked = true;
      return localMockApi.getProducts(filters);
    }
  },

  getProductDetails: async (sku) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${sku}`);
      if (!response.ok) throw new Error('API response not ok');
      const data = await response.json();
      api.isMocked = false;
      return data;
    } catch (error) {
      console.warn(`SoleDeal API details connection failed for ${sku}. Falling back to local Mock database.`, error);
      api.isMocked = true;
      return localMockApi.getProductDetails(sku);
    }
  },

  getDeals: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/deals`);
      if (!response.ok) throw new Error('API response not ok');
      const data = await response.json();
      api.isMocked = false;
      return data;
    } catch (error) {
      console.warn('SoleDeal API deals connection failed. Falling back to local Mock database.', error);
      api.isMocked = true;
      return localMockApi.getDeals();
    }
  }
};
