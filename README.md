# 👟 SoleDeal — Smart Shoe Price Comparison Platform

> **Search once. Compare multiple platforms. Find the best shoe price.**

SoleDeal is a web-based **shoe price comparison platform** that helps users compare the prices of the same shoe across multiple e-commerce platforms such as **Amazon, Flipkart, and Myntra**.

Instead of manually visiting different shopping websites and comparing prices, the user can search for a shoe once. SoleDeal fetches product listings from supported platforms, normalizes the product information, identifies matching shoes using a **custom product-matching algorithm**, and compares their prices to find the cheapest available option.

---

## 📌 Table of Contents

* [Problem Statement](#-problem-statement)
* [Real-World Use Case](#-real-world-use-case)
* [Project Objective](#-project-objective)
* [Our Solution](#-our-solution)
* [Key Features](#-key-features)
* [Approach Used](#-approach-used)
* [System Architecture](#-system-architecture)
* [Application Workflow](#-application-workflow)
* [Product Matching Approach](#-product-matching-approach)
* [Price Comparison Approach](#-price-comparison-approach)
* [Input Example](#-input-example)
* [Output Example](#-output-example)
* [Project Structure](#-project-structure)
* [Technology Stack](#-technology-stack)
* [Backend API](#-backend-api)
* [Environment Variables](#-environment-variables)
* [Installation & Setup](#-installation--setup)
* [Running the Project](#-running-the-project)
* [Error Handling](#-error-handling)
* [Limitations](#-limitations)
* [Future Improvements](#-future-improvements)
* [Conclusion](#-conclusion)

---

# ❗ Problem Statement

Online shoe shoppers often face a common problem:

> **The same shoe can be available at different prices on different e-commerce platforms.**

For example, a user wants to purchase:

**Nike Revolution Running Shoes**

The shoe may be available on:

* Amazon — ₹3,499
* Flipkart — ₹3,299
* Myntra — ₹3,599

To find the cheapest option, the user normally has to:

1. Open Amazon
2. Search for the shoe
3. Check the price
4. Open Flipkart
5. Search again
6. Check the price
7. Open Myntra
8. Search again
9. Compare all the results manually

This process is time-consuming and inconvenient.

### The main problem is:

**How can we allow a user to search for a shoe once and automatically compare the prices of the same product across multiple platforms?**

---

# 🌍 Real-World Use Case

SoleDeal can be useful for anyone who frequently purchases shoes online.

### 👤 Individual Shoppers

A user can search:

```text
Nike Revolution
```

and quickly see which supported platform offers the lowest price.

### 💰 Price-Conscious Buyers

Users who want to save money can directly identify the cheapest available listing instead of checking multiple websites.

### 🛒 Online Shopping Comparison

The platform provides a single interface for comparing product prices across multiple e-commerce platforms.

### 🎓 Academic / College Project

SoleDeal demonstrates how a real-world price-comparison system can be built using:

* REST APIs
* React
* Node.js
* Express
* Product normalization
* String similarity
* Data processing
* Price comparison
* API integration

---

# 🎯 Project Objective

The main objective of SoleDeal is to build a system that:

1. Accepts a shoe search query from the user.
2. Fetches shoe listings from multiple platforms.
3. Converts different API response formats into a common structure.
4. Identifies products that represent the same shoe.
5. Compares their prices.
6. Identifies the cheapest option.
7. Displays the comparison in a simple and user-friendly interface.

---

# 💡 Our Solution

SoleDeal solves the problem using a **multi-stage product comparison pipeline**.

```text
User Search
     ↓
React Frontend
     ↓
Express Backend
     ↓
QuickCommerce API
     ↓
Amazon / Flipkart / Myntra
     ↓
Product Normalization
     ↓
Manual Product Matching
     ↓
Price Comparison
     ↓
Best Price
     ↓
React Frontend
```

The important part of our approach is that we **do not depend on an AI/LLM model for product matching**.

Instead, SoleDeal uses a custom matching algorithm based on:

* Brand comparison
* Product name normalization
* Exact name matching
* Common-word matching
* Similarity calculation
* Minimum similarity threshold

This makes the matching process transparent and easier to understand.

---

# ✨ Key Features

## 🔍 1. Single Search

Users only need to enter the shoe name once.

Example:

```text
Nike Revolution
```

---

## 🛍️ 2. Multi-Platform Search

The backend requests product information from:

* Amazon
* Flipkart
* Myntra

---

## 🔄 3. Product Normalization

Different platforms may use different field names and structures.

For example:

```text
Amazon:
offer_price
images
deeplink
rating_count
```

The system converts these fields into a common product format.

---

## 🧠 4. Manual Product Matching

SoleDeal determines whether products from different platforms are likely to represent the same shoe.

The matching process checks:

* Brand
* Product name
* Normalized text
* Common words
* Similarity percentage

---

## 💰 5. Price Comparison

After identifying the same shoe across platforms, SoleDeal compares:

* Current price
* MRP
* Discount
* Availability
* Rating
* Product URL

---

## 🏆 6. Cheapest Platform Detection

The system automatically identifies the platform offering the lowest price.

Example:

```text
Amazon    ₹3,499
Flipkart  ₹3,299  ← Best Price
Myntra    ₹3,599
```

Result:

```text
Best Platform: Flipkart
Best Price: ₹3,299
```

---

## 📱 7. Responsive Frontend

The frontend is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

---

# 🛠️ Approach Used

The project is divided into several logical stages.

## Step 1 — User Input

The user enters a shoe name in the React search bar.

Example:

```text
Nike Revolution
```

The frontend sends the query to:

```http
GET /api/search?q=Nike%20Revolution
```

---

## Step 2 — Backend Receives Request

The Express controller receives:

```javascript
{
    q: "Nike Revolution",
    lat: 28.6692,
    lon: 77.4538
}
```

The latitude and longitude are used for the external product search API.

---

## Step 3 — Fetch Products

The backend calls the external QuickCommerce API for:

```text
Amazon
Flipkart
Myntra
```

The calls are performed asynchronously.

Conceptually:

```text
Search Nike Revolution

      ├── Amazon API
      ├── Flipkart API
      └── Myntra API
```

---

# 🔄 Product Normalization

Different platforms can return different product structures.

To solve this problem, SoleDeal uses a **normalization layer**.

Every product is converted into a common structure:

```javascript
{
    id: "",
    name: "",
    brand: "",
    platform: "",
    price: 0,
    mrp: 0,
    image: "",
    url: "",
    available: false,
    rating: 0,
    ratingCount: 0,
    quantity: "",
    inventory: null
}
```

This allows the rest of the application to work with products using the same field names regardless of their source platform.

---

# 🧠 Product Matching Approach

One of the biggest challenges in price comparison is identifying the same product.

Different platforms may name the same shoe differently.

For example:

```text
Amazon:
Nike Revolution 7 Men's Running Shoes

Flipkart:
Nike Revolution 7 Running Shoe

Myntra:
Nike Revolution 7 Sports Shoes
```

Although the names are not exactly identical, they may represent the same shoe.

SoleDeal uses a custom matching algorithm.

---

## 1. Text Normalization

Product names are converted to lowercase.

Special characters are removed.

Extra spaces are removed.

Example:

```text
"Nike Revolution 7 - Men's Shoes"
```

becomes:

```text
nike revolution 7 men s shoes
```

---

## 2. Brand Matching

The algorithm first compares the brands.

For example:

```text
Nike vs Nike
```

is valid.

But:

```text
Nike vs Adidas
```

is rejected.

---

## 3. Exact Product Name Matching

If normalized product names are exactly the same:

```text
nike revolution 7
```

and

```text
nike revolution 7
```

the products are considered a match.

---

## 4. Common Word Matching

If the names are not exactly the same, the algorithm compares common words.

For example:

```text
nike revolution 7 running shoes
```

and:

```text
nike revolution 7 mens shoes
```

have several common words.

The system calculates a similarity score:

```text
similarity =
commonWords / totalWords
```

A product is considered a match when the similarity reaches the configured threshold.

---

# 🔗 Three-Platform Matching

SoleDeal requires the product to be available on all three supported platforms before creating a comparison group.

```text
Amazon
   ↓
Find matching Flipkart product
   ↓
Find matching Myntra product
   ↓
Create common product
```

If a matching product is not found on one platform, that product is not included in the final comparison.

---

# 💰 Price Comparison Approach

Once a common product is identified, the system compares the prices.

Example:

```text
Amazon       ₹4,999
Flipkart     ₹4,599
Myntra       ₹4,799
```

The algorithm finds:

```text
Best Price = ₹4,599
Best Platform = Flipkart
```

The comparison also calculates discount percentage when MRP is available.

```text
Discount =
((MRP - Price) / MRP) × 100
```

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               │ Search Query
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │                      │
                    │  SearchBar           │
                    │  ComparisonCard      │
                    └──────────┬───────────┘
                               │
                               │ HTTP Request
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │                      │
                    │ Search Controller    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ QuickCommerce API    │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
           ┌─────────┐   ┌──────────┐   ┌─────────┐
           │ Amazon  │   │ Flipkart │   │ Myntra  │
           └────┬────┘   └────┬─────┘   └────┬────┘
                │             │              │
                └─────────────┼──────────────┘
                              ▼
                    ┌──────────────────────┐
                    │ Product Normalizer   │
                    └──────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Product Matcher      │
                    │                      │
                    │ Brand                │
                    │ Name                 │
                    │ Similarity           │
                    └──────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Price Comparator      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ JSON Response        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ React Comparison UI  │
                    └──────────────────────┘
```

---

# 🔄 Complete Application Workflow

```text
1. User opens SoleDeal
        ↓
2. User enters shoe name
        ↓
3. Frontend sends GET /api/search
        ↓
4. Express controller receives request
        ↓
5. Backend calls QuickCommerce API
        ↓
6. Amazon / Flipkart / Myntra return products
        ↓
7. Products are normalized
        ↓
8. Matching algorithm compares products
        ↓
9. Common products are identified
        ↓
10. Prices are compared
        ↓
11. Cheapest platform is identified
        ↓
12. Backend returns JSON
        ↓
13. React displays comparison cards
```

---

# 📥 Input Example

The frontend accepts a simple shoe search query.

### Example 1

```text
Nike Revolution
```

### Example 2

```text
Adidas Running Shoes
```

### Example 3

```text
Puma Running Shoes
```

### API Request

```http
GET http://localhost:5000/api/search?q=Nike%20Revolution
```

---

# 📤 Output Example

A successful response looks conceptually like:

```json
{
  "success": true,
  "query": "Nike Revolution",
  "location": {
    "lat": 28.6692,
    "lon": 77.4538
  },
  "totalComparisons": 1,
  "comparisons": [
    {
      "productName": "Nike Revolution 7",
      "offers": [
        {
          "platform": "Amazon",
          "name": "Nike Revolution 7",
          "price": 3499,
          "mrp": 4995,
          "discount": 30,
          "image": "https://example.com/image.jpg",
          "url": "https://example.com/product",
          "rating": 4.3
        },
        {
          "platform": "Flipkart",
          "name": "Nike Revolution 7 Running Shoes",
          "price": 3299,
          "mrp": 4995,
          "discount": 34,
          "image": "https://example.com/image.jpg",
          "url": "https://example.com/product",
          "rating": 4.4
        },
        {
          "platform": "Myntra",
          "name": "Nike Revolution 7 Sports Shoes",
          "price": 3599,
          "mrp": 4995,
          "discount": 28,
          "image": "https://example.com/image.jpg",
          "url": "https://example.com/product",
          "rating": 4.2
        }
      ],
      "bestPrice": 3299,
      "bestPlatform": "Flipkart"
    }
  ]
}
```

> **Note:** The values above are an example of the response structure. Actual results depend on the live API response.

---

# 📁 Project Structure

The current project follows a frontend/backend structure similar to:

```text
SoleDeal/
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   └── ComparisonCard.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── Backend/
│   │
│   ├── src/
│   │   │
│   │   ├── controllers/
│   │   │   └── search.controller.js
│   │   │
│   │   ├── routes/
│   │   │   └── search.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── quickcommerce.service.js
│   │   │   ├── normalizer.service.js
│   │   │   ├── matcher.service.js
│   │   │   └── price.service.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🧩 Backend Architecture

The backend is divided into separate responsibilities.

## `server.js`

Starts the Express server and registers routes.

```text
server.js
   ↓
search.routes.js
```

---

## `search.routes.js`

Defines the API route:

```http
GET /api/search
```

and forwards the request to the controller.

---

## `search.controller.js`

Controls the complete search pipeline:

```text
Request
   ↓
QuickCommerce
   ↓
Normalization
   ↓
Matching
   ↓
Price Comparison
   ↓
Response
```

---

## `quickcommerce.service.js`

Responsible for requesting product data from:

```text
Amazon
Flipkart
Myntra
```

---

## `normalizer.service.js`

Converts platform-specific product data into a common structure.

---

## `matcher.service.js`

Identifies products that are likely to represent the same shoe.

---

## `price.service.js`

Compares prices and identifies the cheapest offer.

---

# 🖥️ Frontend Architecture

The React frontend contains the user interface.

### Main Components

### `App.jsx`

Responsible for:

* Search state
* Loading state
* Error handling
* Calling backend API
* Displaying results

### `SearchBar.jsx`

Responsible for:

* User input
* Search button
* Search interaction

### `ComparisonCard.jsx`

Displays:

* Product name
* Platform
* Price
* MRP
* Discount
* Rating
* Product image
* Product link
* Best price

---

# 🔌 REST API

## Search Products

### Endpoint

```http
GET /api/search
```

### Query Parameters

| Parameter | Required | Description               |
| --------- | -------- | ------------------------- |
| `q`       | Yes      | Shoe/product search query |
| `lat`     | No       | Latitude                  |
| `lon`     | No       | Longitude                 |

### Example

```http
GET /api/search?q=Nike%20Revolution
```

With location:

```http
GET /api/search?q=Nike%20Revolution&lat=28.6692&lon=77.4538
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend:

```env
PORT=5000

QUICKCOMMERCE_API_KEY=your_api_key_here
```

If your project uses additional environment variables, add them according to your backend configuration.

### ⚠️ Important

Never upload your real `.env` file to GitHub.

Add:

```text
.env
```

to `.gitignore`.

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Isharana3004/JOVAC-PROJ.git
```

Then:

```bash
cd JOVAC-PROJ
```

---

# Backend Setup

Open a terminal:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
Backend/.env
```

Add:

```env
PORT=5000
QUICKCOMMERCE_API_KEY=your_api_key_here
```

---

# Start Backend

From the `Backend` directory:

```bash
node src/server.js
```

Expected output:

```text
SoleDeal Backend running on http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

Navigate to your frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

Open it in your browser.

---

# 🧪 Testing the Backend

You can test the API using a browser, Postman, or another API client.

Example:

```http
GET http://localhost:5000/api/search?q=Nike%20Revolution
```

If the backend is working, it should return a JSON response.

---

# ❌ Error Handling

The application handles common errors such as:

### Empty Search

```json
{
  "success": false,
  "message": "Search query is required"
}
```

### Server Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": "..."
}
```

### External API Failure

If one of the supported platforms fails to return data, the backend logs the error and continues processing the available results.

---

# 💳 API Credits

SoleDeal depends on the external QuickCommerce API for retrieving product data.

Therefore, successful product retrieval depends on:

* Valid API key
* Available API credits
* External API availability
* Platform data availability

If the API account has no active credits, the backend may return:

```text
insufficient_credits
```

In that situation, the external API account needs to be topped up.

---

# ⚠️ Current Limitations

The current version has some limitations.

### 1. Matching Accuracy

The product matching algorithm is based on text similarity.

Therefore, some complex product variations may not always be matched perfectly.

---

### 2. Three-Platform Requirement

A product is currently considered a common comparison product only when a matching product exists on:

```text
Amazon + Flipkart + Myntra
```

If the product is missing from one platform, it may not appear in the final comparison.

---

### 3. External API Dependency

Product data depends on the external API.

If the external API is unavailable or out of credits, product results may not be available.

---

### 4. Live Prices

Prices can change on shopping platforms.

Therefore, the displayed price represents the data returned by the API at the time of the search.

---

# 🔮 Future Improvements

Several improvements can be added in future versions.

## 🤖 Better Product Matching

The current custom string matching algorithm can be improved using:

* Product model numbers
* SKU
* Product IDs
* Color
* Gender
* Size
* Structured attributes
* Advanced similarity algorithms

---

## 🏪 More Platforms

Additional shopping platforms can be integrated.

For example:

```text
Amazon
Flipkart
Myntra
Ajio
Tata CLiQ
Other supported platforms
```

---

## 🔎 Advanced Filters

Future versions can support:

* Brand
* Size
* Gender
* Category
* Price range
* Discount
* Rating
* Platform

---

## 📊 Price History

A future version could store historical prices and show:

```text
Price today
Price yesterday
Lowest price
Highest price
Average price
```

---

## 🔔 Price Drop Alerts

Users could receive notifications when the price of a selected shoe falls below a target price.

---

## 🗄️ Database Integration

A database can be used to store:

* Products
* Price history
* Search history
* User preferences
* Favorite products

---

# 🔐 Security Considerations

API keys should never be exposed in frontend code.

The architecture keeps the external API key on the backend:

```text
Frontend
   ↓
Backend
   ↓
External API
```

rather than:

```text
Frontend
   ↓
External API + Secret Key ❌
```

This helps prevent exposing sensitive API credentials to users.

---

# 📊 Example Use Case

Suppose a user wants to buy:

```text
Nike Revolution
```

Instead of searching three websites manually:

```text
Amazon → Search → Check Price
Flipkart → Search → Check Price
Myntra → Search → Check Price
```

the user performs:

```text
SoleDeal
   ↓
Search "Nike Revolution"
   ↓
Compare results
   ↓
See best price
```

Example:

```text
Nike Revolution 7

Amazon       ₹3,499
Flipkart     ₹3,299  ← BEST PRICE
Myntra       ₹3,599
```

The user can then open the product listing directly through the provided product URL.

---

# 🎓 What We Learned

While developing SoleDeal, the project demonstrates practical concepts such as:

* React component development
* REST API integration
* Express.js routing
* Backend architecture
* Asynchronous JavaScript
* Axios API requests
* API error handling
* CORS configuration
* Data normalization
* String processing
* Product matching
* Algorithmic similarity
* Price comparison
* JSON data processing
* Frontend-backend communication

---

# 🧠 Why This Approach?

We chose a custom matching algorithm instead of depending on an AI/LLM system because the current project focuses on implementing the product comparison logic ourselves.

This provides:

* Transparent matching logic
* Predictable behavior
* No AI API dependency
* Lower processing cost
* Easier debugging
* Better understanding of the underlying algorithm

---

# 📈 Overall Data Flow

```text
                   USER
                    │
                    ▼
            ┌───────────────┐
            │ React Frontend│
            └───────┬───────┘
                    │
                    │ GET /api/search
                    ▼
            ┌───────────────┐
            │ Express Server│
            └───────┬───────┘
                    │
                    ▼
          ┌───────────────────┐
          │ QuickCommerce API │
          └─────────┬─────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Amazon       Flipkart      Myntra
       │            │            │
       └────────────┼────────────┘
                    ▼
          Product Normalization
                    │
                    ▼
           Product Matching
                    │
                    ▼
            Common Products
                    │
                    ▼
            Price Comparison
                    │
                    ▼
              Best Price
                    │
                    ▼
            JSON API Response
                    │
                    ▼
            React Comparison UI
```

---

# 📜 License

This project is developed for **academic and educational purposes** as a college project.

---

# 👥 Project

## SoleDeal

**Smart Shoe Price Comparison Platform**

### Core Concept

> **Search once. Compare multiple platforms. Find the best deal.**

---

# ❤️ Conclusion

SoleDeal addresses a simple but practical e-commerce problem: **finding the best price for the same shoe across multiple shopping platforms**.

The project combines a React frontend with a Node.js/Express backend and an external product-search API. The backend processes the raw product data, normalizes different platform responses, uses a custom product-matching algorithm to identify common shoes, and compares prices to determine the best available deal.

The project provides a practical demonstration of how multiple APIs, backend services, algorithms, and a modern frontend can work together to solve a real-world shopping problem.

---

**Built with ❤️ as a college project**

### 👟 SoleDeal

**Find the shoe. Compare the price. Get the better deal.**
