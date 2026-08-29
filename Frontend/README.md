# 👟 SoleDeal — Smart Shoe Price Comparison Platform

SoleDeal is a full-stack web application that lets you search for any shoe and instantly compare prices across **Amazon**, **Flipkart**, and **Myntra** in a single view. It features user authentication, a personal wishlist, and a clean dark-themed UI.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication & JWT Setup](#authentication--jwt-setup)
- [Wishlist Feature](#wishlist-feature)

---

## ✨ Features

- 🔍 **Real-time price comparison** across Amazon, Flipkart, and Myntra
- 🏷️ **Best deal highlighting** — instantly see which platform offers the lowest price
- ❤️ **Wishlist** — save your favourite shoe deals (requires login)
- 🔐 **User Authentication** — Sign In / Register with JWT token support
- 🧠 **Smart product matching** — fuzzy name matching with brand-aware deduplication
- 💾 **Per-user wishlist persistence** — saved securely in browser localStorage per account
- 📱 **Responsive UI** — works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4        |
| Backend   | Node.js, Express.js                    |
| Database  | MongoDB (via Mongoose)                 |
| Data API  | QuickCommerce API                      |
| Auth      | JWT (placeholder-ready in `auth.js`)   |

---

## 📁 Project Structure

```
Soledeal/
├── Backend/
│   ├── .env                          # Backend environment variables
│   └── src/
│       ├── server.js                 # Express app entry point
│       ├── config/
│       │   └── database.js           # MongoDB connection
│       ├── controllers/
│       │   └── search.controller.js  # Handles search API logic
│       ├── models/
│       │   ├── Product.js            # Mongoose product schema
│       │   └── Price.js              # Mongoose price schema
│       ├── routes/
│       │   └── search.routes.js      # API route: GET /api/search
│       └── services/
│           ├── quickcommerce.service.js  # Calls external QuickCommerce API
│           ├── normalizer.service.js     # Normalizes raw API responses
│           ├── matcher.service.js        # Fuzzy product matching logic
│           ├── price.service.js          # Price comparison & best deal logic
│           └── product.service.js        # Product helper utilities
│
└── Frontend/
    ├── .env                          # Frontend environment variables (Vite)
    └── src/
        ├── App.jsx                   # Root component with all state management
        ├── components/
        │   ├── Navbar.jsx            # Navigation bar with auth + wishlist
        │   ├── SearchBar.jsx         # Search input with quick-search chips
        │   ├── ComparisonCard.jsx    # Per-shoe comparison card (3 platforms)
        │   ├── AuthModal.jsx         # Sign In / Register modal
        │   └── WishlistDrawer.jsx    # Side drawer showing saved deals
        └── utils/
            └── auth.js               # Auth helpers + JWT token integration
```

---

## ⚙️ How It Works

```
User searches "Nike Air Max"
        │
        ▼
Frontend sends GET /api/search?q=Nike+Air+Max
        │
        ▼
Backend calls QuickCommerce API for:
  ├── Amazon
  ├── Flipkart
  └── Myntra
        │
        ▼
normalizer.service.js
  → Normalizes each platform's response into a common product shape
        │
        ▼
matcher.service.js
  → Fuzzy-matches products across platforms using brand + keyword similarity
  → Keeps only products found on all 3 platforms
        │
        ▼
price.service.js
  → Compares prices, calculates discounts, identifies the best deal
        │
        ▼
Frontend renders ComparisonCard
  → Shows all 3 platform offers side-by-side
  → Highlights the platform with the lowest price
  → User can ❤️ save any offer to their Wishlist
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm (comes with Node.js)

---

### Backend Setup

**1. Navigate to the Backend folder:**
```bash
cd Soledeal/Backend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create or edit the `.env` file:**
```env
PORT=5000
QUICKCOMMERCE_API_KEY=your_quickcommerce_api_key_here
MONGODB_URI=mongodb://localhost:27017/sole
```

**4. Start the server:**
```bash
node src/server.js
```

The backend will start at **`http://localhost:5000`**

---

### Frontend Setup

**1. Navigate to the Frontend folder:**
```bash
cd Soledeal/Frontend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create or edit the `.env` file:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_JWT_TOKEN=your_jwt_token_here
```

**4. Start the development server:**
```bash
npm run dev
```

The frontend will start at **`http://localhost:5173`**

Open your browser and visit `http://localhost:5173` to start comparing shoe prices!

---

## 🔑 Environment Variables

### Backend — `Backend/.env`

| Variable               | Description                                  | Example                                |
|------------------------|----------------------------------------------|----------------------------------------|
| `PORT`                 | Port the Express server runs on              | `5000`                                 |
| `QUICKCOMMERCE_API_KEY`| API key for the QuickCommerce product API    | `63cb017f-8f64-401b-ac62-b9e2b8b8e642` |
| `MONGODB_URI`          | MongoDB connection string                    | `mongodb://localhost:27017/sole`        |

### Frontend — `Frontend/.env`

| Variable            | Description                                              | Default                          |
|---------------------|----------------------------------------------------------|----------------------------------|
| `VITE_API_BASE_URL` | Base URL for the backend API                            | `http://localhost:5000/api`      |
| `VITE_JWT_TOKEN`    | Your JWT token (manually set for testing without login) | `your_jwt_token_here`            |

> **Note:** Vite requires all frontend environment variables to be prefixed with `VITE_` to be accessible in the browser.

---

## 📡 API Reference

### `GET /api/search`

Search for shoes and get a price comparison across all three platforms.

**Query Parameters:**

| Parameter | Type   | Required | Default     | Description                            |
|-----------|--------|----------|-------------|----------------------------------------|
| `q`       | string | ✅ Yes   | —           | Shoe name to search (e.g. `Nike Air Max`) |
| `lat`     | number | ❌ No    | `28.6692`   | Latitude for location-aware results    |
| `lon`     | number | ❌ No    | `77.4538`   | Longitude for location-aware results   |

**Example Request:**
```
GET http://localhost:5000/api/search?q=Nike+Air+Max
```

**Example Response:**
```json
{
  "success": true,
  "query": "Nike Air Max",
  "location": { "lat": 28.6692, "lon": 77.4538 },
  "totalComparisons": 2,
  "comparisons": [
    {
      "productName": "Nike Air Max 270",
      "bestPrice": 7495,
      "bestPlatform": "Flipkart",
      "offers": [
        {
          "platform": "Amazon",
          "name": "Nike Air Max 270 Running Shoes",
          "price": 8299,
          "mrp": 10995,
          "discount": 24,
          "image": "https://...",
          "url": "https://amazon.in/...",
          "rating": 4.3
        },
        {
          "platform": "Flipkart",
          "name": "Nike Air Max 270",
          "price": 7495,
          "mrp": 10995,
          "discount": 31,
          "image": "https://...",
          "url": "https://flipkart.com/...",
          "rating": 4.1
        },
        {
          "platform": "Myntra",
          "name": "Nike Air Max 270 Sneakers",
          "price": 8999,
          "mrp": 10995,
          "discount": 18,
          "image": "https://...",
          "url": "https://myntra.com/...",
          "rating": 4.0
        }
      ]
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Search query is required"
}
```

---

## 🔐 Authentication & JWT Setup

Authentication is implemented with a clean placeholder-ready structure. The JWT integration points are clearly marked in [`Frontend/src/utils/auth.js`](./Frontend/src/utils/auth.js).

### Option A: Manual JWT via `.env` (Quick Testing)

Add your JWT token directly to `Frontend/.env`:
```env
VITE_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The app will automatically use this token for all authenticated API requests via the `Authorization: Bearer <token>` header.

### Option B: Connect Your Backend Auth API (Full Integration)

Open `Frontend/src/utils/auth.js` and uncomment the real API call inside `loginUser()`:

```js
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Authentication failed");

  // Stores the JWT token from your backend response
  setAuthToken(data.token);

  localStorage.setItem("soledeal_user", JSON.stringify(data.user));
  return data.user;
}
```

### Using Auth Headers in API Calls

```js
import { getAuthHeaders } from "./utils/auth";

fetch(`${API_BASE_URL}/user/profile`, {
  method: "GET",
  headers: getAuthHeaders(),
  // Automatically sends: Authorization: Bearer <your_jwt_token>
});
```

---

## ❤️ Wishlist Feature

- **Login required:** Clicking the heart `🤍` button on any shoe offer without being logged in will automatically open the Sign In / Register modal.
- **Auto-save on login:** The item you tried to save is automatically added to your wishlist as soon as you log in or register — no need to click again.
- **Per-user storage:** Each user's wishlist is stored separately in `localStorage` using the key `soledeal_wishlist_<user_id>`, so multiple users on the same device keep independent wishlists.
- **Persistent across sessions:** Your wishlist stays saved even after refreshing or closing the browser.
- **Wishlist drawer:** Click the ❤️ **Wishlist** button in the header to open the side panel showing all saved deals with platform labels, prices, discounts, and direct buy links.
