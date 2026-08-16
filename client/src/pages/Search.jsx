import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search as SearchIcon, ArrowUpDown, RefreshCw, X, Tag } from 'lucide-react';
import { api } from '../services/api';
import BestDealBadge from '../components/BestDealBadge';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search input state
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  // Filter states (bound to search params)
  const brandFilter = searchParams.get('brand') || '';
  const sizeFilter = searchParams.get('size') || '';
  const genderFilter = searchParams.get('gender') || '';
  const categoryFilter = searchParams.get('category') || '';
  const storeFilter = searchParams.get('store') || '';
  const sortOption = searchParams.get('sort') || 'bestDeal';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';
  const discountMin = searchParams.get('discountMin') || '';

  // Trigger search on parameter changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const filters = {
          brand: brandFilter,
          size: sizeFilter,
          gender: genderFilter,
          category: categoryFilter,
          store: storeFilter,
          sort: sortOption,
          priceMin,
          priceMax,
          discountMin,
          q: searchParams.get('q') || ''
        };
        const data = await api.getProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchParams]);

  // Update query params helper
  const updateFilters = (newFilters) => {
    const current = {};
    // Extract current params
    for (const [key, value] of searchParams.entries()) {
      current[key] = value;
    }
    // Merge new filters
    const merged = { ...current, ...newFilters };
    // Remove empty values
    Object.keys(merged).forEach(key => {
      if (merged[key] === '' || merged[key] === null || merged[key] === undefined) {
        delete merged[key];
      }
    });
    setSearchParams(merged);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ q: searchInput });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'ASICS', 'Reebok', 'Skechers'];
  const sizes = [5, 6, 7, 8, 9, 10, 11, 12];
  const categories = ['Running', 'Sneakers', 'Classic', 'Training'];
  const genders = ['Men', 'Women', 'Unisex'];
  const stores = ['SoleStore', 'FootPulse', 'SneakerSphere', 'FitWay'];

  const FilterSidebar = () => (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h3 className="font-extrabold text-whiteAccent flex items-center space-x-2">
          <Filter size={16} className="text-purpleAccent" />
          <span>Filters</span>
        </h3>
        <button 
          onClick={clearAllFilters}
          className="text-xs text-cyanAccent hover:text-whiteAccent font-semibold transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Brand Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Brand</label>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center space-x-2 text-slate-300 hover:text-whiteAccent cursor-pointer transition-colors">
              <input
                type="radio"
                name="brand"
                checked={brandFilter === brand}
                onChange={() => updateFilters({ brand: brandFilter === brand ? '' : brand })}
                className="rounded border-slate-700 bg-slate-900 text-purpleAccent focus:ring-purpleAccent"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Gender</label>
        <select
          value={genderFilter}
          onChange={(e) => updateFilters({ gender: e.target.value })}
          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
        >
          <option value="">All Genders</option>
          {genders.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Category</label>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center space-x-2 text-slate-300 hover:text-whiteAccent cursor-pointer transition-colors">
              <input
                type="radio"
                name="category"
                checked={categoryFilter === cat}
                onChange={() => updateFilters({ category: categoryFilter === cat ? '' : cat })}
                className="rounded border-slate-700 bg-slate-900 text-purpleAccent focus:ring-purpleAccent"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Shoe Size (UK)</label>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => updateFilters({ size: sizeFilter === String(size) ? '' : String(size) })}
              className={`py-2 text-xs font-bold rounded-lg border transition-all duration-200 ${
                sizeFilter === String(size)
                  ? 'bg-gradient-to-r from-purpleAccent to-cyanAccent border-transparent text-[#030712]'
                  : 'bg-white/5 border-white/5 text-mutedText hover:border-white/20 hover:text-whiteAccent'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Price Range (₹)</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => updateFilters({ priceMin: e.target.value })}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />
          <span className="text-mutedText">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => updateFilters({ priceMax: e.target.value })}
            className="w-full px-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Store Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Store</label>
        <select
          value={storeFilter}
          onChange={(e) => updateFilters({ store: e.target.value })}
          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
        >
          <option value="">All Stores</option>
          {stores.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Discount Minimum */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-mutedText mb-3">Min Discount</label>
        <select
          value={discountMin}
          onChange={(e) => updateFilters({ discountMin: e.target.value })}
          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
        >
          <option value="">Any Discount</option>
          <option value="10">10% OFF or more</option>
          <option value="20">20% OFF or more</option>
          <option value="30">30% OFF or more</option>
          <option value="40">40% OFF or more</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center md:justify-between pb-6 border-b border-white/5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-whiteAccent flex items-center space-x-2">
            <span>SoleDeal Comparison Engine</span>
          </h1>
          <p className="text-xs text-mutedText mt-1">
            {products.length} {products.length === 1 ? 'result' : 'results'} found {searchParams.get('q') && `for "${searchParams.get('q')}"`}
          </p>
        </div>

        {/* Top Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md flex items-center p-1 rounded-xl glass-input">
          <input
            type="text"
            placeholder="Search brand, model, categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent px-3 py-1.5 focus:outline-none text-xs text-whiteAccent"
          />
          {searchInput && (
            <button 
              type="button" 
              onClick={() => { setSearchInput(''); updateFilters({ q: '' }); }}
              className="p-1 text-mutedText hover:text-whiteAccent mr-1"
            >
              <X size={14} />
            </button>
          )}
          <button 
            type="submit" 
            className="p-2 bg-gradient-to-r from-purpleAccent to-cyanAccent rounded-lg text-whiteAccent text-xs font-bold"
          >
            <SearchIcon size={14} />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar (Left) */}
        <aside className="hidden lg:block lg:col-span-1 glass-card p-6 rounded-2xl border border-white/5 h-fit sticky top-24">
          <FilterSidebar />
        </aside>

        {/* Mobile Filter & Sort Bar */}
        <div className="lg:hidden flex items-center justify-between p-3 glass-card rounded-xl border border-white/5 col-span-1">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center space-x-2 text-xs font-extrabold text-whiteAccent bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
          >
            <SlidersHorizontal size={14} className="text-purpleAccent" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2">
            <ArrowUpDown size={14} className="text-cyanAccent" />
            <select
              value={sortOption}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="bg-transparent border-none text-xs font-bold text-whiteAccent focus:ring-0 cursor-pointer"
            >
              <option value="bestDeal" className="bg-[#0B1120] text-slate-100">Best Deal</option>
              <option value="lowestPrice" className="bg-[#0B1120] text-slate-100">Lowest Price</option>
              <option value="highestDiscount" className="bg-[#0B1120] text-slate-100">Highest Discount</option>
              <option value="rating" className="bg-[#0B1120] text-slate-100">Rating</option>
            </select>
          </div>
        </div>

        {/* Main Content Area (Right / Center) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Desktop Toolbar */}
          <div className="hidden lg:flex items-center justify-between pb-2">
            <span className="text-xs text-mutedText font-semibold">
              Showing active deals across trusted sneaker stores.
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-mutedText font-bold">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="glass-input rounded-xl px-3 py-1.5 text-xs font-bold text-whiteAccent"
              >
                <option value="bestDeal">Best Deal Score</option>
                <option value="lowestPrice">Lowest Price</option>
                <option value="highestDiscount">Highest Discount</option>
                <option value="rating">Store Rating</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="glass-card rounded-2xl h-96 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-white/5">
              <p className="text-lg font-bold text-whiteAccent">No deals match your parameters</p>
              <p className="text-sm text-mutedText mt-2">Try resetting your filters or adjusting your search keywords.</p>
              <button
                onClick={clearAllFilters}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-purpleAccent to-cyanAccent text-[#030712] font-black rounded-xl text-sm"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(shoe => {
                const savings = shoe.originalPrice - shoe.bestDeal.price;
                
                return (
                  <div 
                    key={shoe.sku}
                    className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-purpleAccent/20 flex flex-col group h-full bg-[#0B1120]/30 backdrop-blur-md"
                  >
                    {/* Visual Card Top */}
                    <div className="relative aspect-video bg-[#0B1120] overflow-hidden flex items-center justify-center p-4 border-b border-white/5">
                      <img 
                        src={shoe.image} 
                        alt={shoe.name} 
                        className="max-h-32 object-contain transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                        <BestDealBadge className="!px-2 !py-0.5" />
                      </div>
                      
                      {/* Deal Score Badge */}
                      <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-0.5 rounded bg-purpleAccent/20 border border-purpleAccent/40 font-bold text-[9px] text-purpleAccent tracking-wide">
                        <span>Score: {shoe.dealScore}</span>
                      </div>
                    </div>

                    {/* Card Description */}
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-cyanAccent uppercase tracking-widest">{shoe.brand}</span>
                          <span className="text-[9px] text-mutedText font-semibold">⭐ {shoe.bestDeal.rating} rating</span>
                        </div>
                        <h3 className="text-sm font-black text-whiteAccent group-hover:text-purpleAccent transition-colors duration-300 line-clamp-1">
                          {shoe.model}
                        </h3>
                        <p className="text-xs text-mutedText line-clamp-1 leading-tight">{shoe.name}</p>
                      </div>

                      {/* Sizes list */}
                      <div className="mt-3">
                        <span className="text-[9px] text-mutedText uppercase tracking-wider block mb-1">UK Sizes:</span>
                        <div className="flex flex-wrap gap-1">
                          {shoe.sizes.slice(0, 5).map(size => (
                            <span key={size} className="text-[9px] px-1 bg-white/5 border border-white/5 rounded text-slate-300">
                              {size}
                            </span>
                          ))}
                          {shoe.sizes.length > 5 && (
                            <span className="text-[9px] px-1 bg-white/5 text-mutedText rounded font-bold">
                              +{shoe.sizes.length - 5}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing block */}
                      <div className="mt-5 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-mutedText uppercase tracking-wider">Cheapest store ({shoe.bestDeal.store})</span>
                            <div className="flex items-baseline space-x-1.5 mt-0.5">
                              <span className="text-lg font-black text-bestDeal">₹{shoe.bestDeal.price.toLocaleString('en-IN')}</span>
                              <span className="text-xs text-mutedText line-through">₹{shoe.originalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <span className="text-[10px] font-extrabold text-bestDeal/90">Save ₹{savings.toLocaleString('en-IN')}</span>
                          </div>
                          
                          <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-extrabold text-[10px] px-2 py-0.5 rounded">
                            {shoe.bestDeal.discount}% OFF
                          </div>
                        </div>

                        <Link 
                          to={`/product/${shoe.sku}`}
                          className="w-full mt-4 py-2.5 px-4 rounded-xl font-extrabold text-xs text-whiteAccent bg-white/5 hover:bg-gradient-to-r hover:from-purpleAccent hover:to-cyanAccent hover:text-[#030712] border border-white/10 hover:border-transparent flex items-center justify-center space-x-1 transition-all duration-300"
                        >
                          <span>Compare {shoe.listingsCount} Offers →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-md p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
            <h2 className="text-lg font-black text-whiteAccent">Filtering Parameters</h2>
            <button 
              onClick={() => setMobileFiltersOpen(false)}
              className="p-1 text-mutedText hover:text-whiteAccent"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto pb-20">
            <FilterSidebar />
          </div>
          <div className="fixed bottom-0 left-0 w-full p-4 bg-secondary border-t border-white/5 flex gap-4">
            <button
              onClick={() => { clearAllFilters(); setMobileFiltersOpen(false); }}
              className="w-1/2 py-3 rounded-xl bg-white/5 text-mutedText font-bold text-xs"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-purpleAccent to-cyanAccent text-[#030712] font-black text-xs"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
