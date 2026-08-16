# 👟 SoleDeal — Smart Shoe Price Comparison Platform

<div align="center">

![SoleDeal Banner](https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80)

### *Search once. Compare everywhere. Find your SoleDeal.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## 🌟 What is SoleDeal?

**SoleDeal** is a premium shoe price comparison web application that helps shoppers find the **absolute best deal** on their favourite sneakers and running shoes across multiple online stores — all in one place.

> 💡 **Core Idea:** Instead of opening 10 different browser tabs to compare prices for a pair of Nike Air Max 270 or Adidas Ultraboost, SoleDeal aggregates all store listings for the same shoe, runs a custom scoring algorithm, and instantly surfaces the **best deal**.

```
User searches "Nike Air Max 270"
         ↓
SoleDeal fetches listings from multiple stores
         ↓
Normalization layer groups them as the same product
         ↓
Best Deal Algorithm scores each listing (0–100)
         ↓
User sees the winner instantly ✅
```

---

## ✨ Features

### 🔍 Powerful Search & Comparison
- Full-text shoe search across brands, models, and categories
- Multi-store price comparison in a single view
- Filters: **Brand, Size, Gender, Category, Store, Price Range, Minimum Discount**
- Sorting: **Best Deal Score, Lowest Price, Highest Discount, Rating**

### 🧮 Smart Deal Score (Calculated — Not AI)
Every store listing gets a transparent **Deal Score out of 100**, computed from:

| Factor | Weight | Description |
|---|---|---|
| 💰 Price Ranking | 40 pts | How cheap vs other stores? |
| 🏷️ Discount % | 30 pts | How big is the markdown? |
| 🚚 Delivery Cost | 15 pts | Free = full points |
| ⭐ Store Rating | 15 pts | Trusted seller credibility |

### 📈 Price History Chart
A custom-drawn **SVG line graph** tracks the price progression of each shoe model across time, showing when prices dropped and what the current all-time low is.

### 🏆 Best Deal Highlighting
- **BEST DEAL** badge on the winning store listing
- Exact savings shown: *"Save ₹4,996"*
- Clearly distinguished: Original Price → Discounted Price → Delivery Fee → **Total Cost**

### 🌌 Night-Sky Glassmorphism UI
- Deep `#030712` space-dark background
- Canvas-based twinkling **starfield animation**
- Subtle purple/blue/cyan **atmospheric glow** backdrops
- **Glass cards** with backdrop blur and border transparency
- Smooth Framer Motion **page transitions & hover effects**

### 📱 Fully Responsive Design
- Desktop: Full sidebar filters + comparison table
- Tablet: Adaptive grid layouts
- Mobile: Collapsing **filter drawer** + **stacked comparison cards**

---

## 🗂️ Project Structure

```
SoleDeal/
├── 📁 client/                          # React + Vite Frontend
│   ├── 📁 public/
│   │   └── favicon.svg                 # Custom sneaker price-tag logo
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── BackgroundStars.jsx     # Canvas starfield animation
│   │   │   ├── Navbar.jsx              # Responsive glassmorphic navbar
│   │   │   ├── Footer.jsx              # Brand footer with links
│   │   │   ├── BestDealBadge.jsx       # Glowing "BEST DEAL" badge
│   │   │   └── DealScoreGauge.jsx      # SVG circular score ring
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx                # Landing page with hero + sections
│   │   │   ├── Search.jsx              # Catalog with filters & sorting
│   │   │   └── ProductDetails.jsx      # Full comparison + price chart
│   │   ├── 📁 services/
│   │   │   └── api.js                  # API client with mock fallback
│   │   ├── App.jsx                     # Router + global layout
│   │   └── index.css                   # Glassmorphism design system
│   ├── tailwind.config.js              # Custom color palette & animations
│   └── postcss.config.js
│
├── 📁 server/                          # Node.js + Express Backend
│   ├── 📁 models/
│   │   └── Product.js                  # Mongoose schema for shoe listings
│   ├── 📁 utils/
│   │   ├── matching.js                 # Product normalization & matching
│   │   └── algorithms.js               # Best Deal & Deal Score calculations
│   ├── 📁 scripts/
│   │   └── seed.js                     # Seed 20 shoes × 3 stores = 60 listings
│   ├── server.js                       # Express REST API endpoints
│   ├── .env.example                    # Environment variable template
│   └── package.json
│
└── .gitignore
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | Component UI framework |
| **Vite** | 5 | Build tool & dev server |
| **Tailwind CSS** | v3 | Utility-first styling |
| **Framer Motion** | 11 | Animations & transitions |
| **Lucide React** | Latest | Icon library |
| **React Router DOM** | v6 | Client-side routing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS | Server runtime |
| **Express** | 4 | REST API framework |
| **Mongoose** | 8 | MongoDB ODM |
| **MongoDB Atlas** | Cloud | Database |
| **dotenv** | 16 | Environment config |
| **CORS** | 2 | Cross-origin requests |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ installed
- A MongoDB Atlas account (free tier works) OR local MongoDB
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Isharana3004/JOVAC-PROJ.git
cd JOVAC-PROJ
```

### 2. Set Up the Backend (Server)
```bash
# Navigate into the server directory
cd server

# Install dependencies
npm install

# Create your environment config from the template
copy .env.example .env
```

Now open `server/.env` and fill in your **MongoDB Atlas URI**:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/soledeal
```

### 3. Seed the Database
```bash
# While still inside /server
npm run seed
```
This populates the database with **20 shoe models** (Nike, Adidas, Puma, New Balance, ASICS, Reebok, Skechers) and **3 store listings each** — fully ready for comparison demos.

```
✅ Seeded 60 store listings for 20 unique shoe models.
```

### 4. Start the Backend Server
```bash
npm run dev
# → SoleDeal API Server listening on port 5000
```

### 5. Set Up and Start the Frontend (Client)
```bash
# Open a new terminal, navigate to /client
cd ../client

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
# → Local: http://localhost:5173
```

### 6. Open in Browser
Visit **[http://localhost:5173](http://localhost:5173)** 🎉

> **No MongoDB yet?** No problem! The frontend has a full **client-side mock fallback**. If the backend isn't reachable, the app automatically serves realistic demo data so all features work immediately.

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/products` | Get all shoes (with filters & sorting) |
| `GET` | `/api/products/:sku` | Get full comparison details for one shoe |
| `GET` | `/api/deals` | Get top 6 highest-discount deals |

### Query Parameters for `/api/products`

| Param | Type | Example |
|---|---|---|
| `q` | string | `?q=Air Max 270` |
| `brand` | string | `?brand=Nike` |
| `gender` | string | `?gender=Men` |
| `category` | string | `?category=Running` |
| `size` | number | `?size=9` |
| `store` | string | `?store=SoleStore` |
| `priceMin` | number | `?priceMin=5000` |
| `priceMax` | number | `?priceMax=15000` |
| `discountMin` | number | `?discountMin=30` |
| `sort` | string | `?sort=bestDeal \| lowestPrice \| highestDiscount \| rating` |

---

## 🧠 How the Deal Score Works

```javascript
// algorithms.js — simplified logic

function calculateDealScore(product, allStoreListings) {

  // 1. Discount Score (0–30 points)
  const discountScore = Math.min((discount / 50) * 30, 30);

  // 2. Price Positioning Score (0–40 points)
  //    40 pts = cheapest store | 0 pts = most expensive store
  const priceScore = 40 * (1 - (price - minPrice) / (maxPrice - minPrice));

  // 3. Delivery Score (0–15 points)
  //    Free shipping = 15 pts | Deduct 1pt per ₹10
  const deliveryScore = Math.max(15 - (deliveryFee / 10), 0);

  // 4. Store Rating Score (0–15 points)
  const ratingScore = (rating / 5) * 15;

  return Math.round(discountScore + priceScore + deliveryScore + ratingScore);
}
```

| Score Range | Label |
|---|---|
| 90–100 | 🟢 Excellent Deal |
| 75–89 | 🟩 Great Deal |
| 60–74 | 🔵 Good Deal |
| 45–59 | 🟡 Fair Deal |
| Below 45 | ⚪ Average Deal |

---

## 🎨 Design System

The entire visual identity is built around a **night-sky glassmorphism** concept:

```css
/* Core Palette */
--background:   #030712   /* Deep space black */
--secondary:    #0B1120   /* Dark navy blue */
--glass-bg:     rgba(255, 255, 255, 0.04)
--glass-border: rgba(255, 255, 255, 0.08)
--purple:       #8B5CF6   /* Primary accent */
--blue:         #3B82F6   /* Secondary accent */
--cyan:         #22D3EE   /* Highlight accent */
--white:        #F8FAFC   /* Primary text */
--muted:        #94A3B8   /* Secondary text */
--best-deal:    #22C55E   /* Best deal green */
```

---

## 🛍️ Demo Data — Brands & Shoes Included

| Brand | Models |
|---|---|
| **Nike** | Air Max 270, Dunk Low, Air Force 1, Pegasus 40 |
| **Adidas** | Ultraboost 22, Stan Smith, NMD_R1, Samba OG |
| **Puma** | Suede Classic, RS-X, Velocity Nitro 2 |
| **New Balance** | 574, 990v6, Fresh Foam 1080v12 |
| **ASICS** | Gel-Kayano 30, Gel-Nimbus 25 |
| **Reebok** | Club C 85, Nano X3 |
| **Skechers** | Go Run Razor 4, Arch Fit |

Stores simulated: **SoleStore, FootPulse, SneakerSphere, FitWay**

---

## 📄 Environment Variables

Create `server/.env` using the provided `server/.env.example`:

```env
# Server port
PORT=5000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/soledeal?retryWrites=true&w=majority
```

> ⚠️ **Never commit your `.env` file.** It is excluded by `.gitignore` to keep your credentials safe.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

This project was built as part of the **JOVAC Project** initiative.

---

<div align="center">

### Built with ❤️ for JOVAC

**SoleDeal** — *Find the best price. Every time.*

</div>
