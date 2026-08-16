import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Tag, ArrowRight, TrendingUp, DollarSign, Award, Clock, ArrowDownRight, Compass, Shield, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import BestDealBadge from '../components/BestDealBadge';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingShoes, setTrendingShoes] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products and take the first 4 as trending, and deals for best deals
        const products = await api.getProducts();
        const deals = await api.getDeals();
        
        setTrendingShoes(products.slice(0, 4));
        setBestDeals(deals.slice(0, 3));
      } catch (error) {
        console.error('Error fetching landing page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/compare?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/compare');
    }
  };

  const handleBrandClick = (brandName) => {
    navigate(`/compare?brand=${encodeURIComponent(brandName)}`);
  };

  const popularBrands = [
    { name: 'Nike', logo: 'N' },
    { name: 'Adidas', logo: 'A' },
    { name: 'Puma', logo: 'P' },
    { name: 'New Balance', logo: 'NB' },
    { name: 'ASICS', logo: 'AS' },
    { name: 'Reebok', logo: 'R' },
    { name: 'Skechers', logo: 'S' }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background -z-10" />
        
        {/* Sub-badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
        >
          <Tag size={12} className="text-cyanAccent animate-pulse" />
          <span className="text-[10px] md:text-xs text-slate-300 font-extrabold uppercase tracking-widest">
            Search Once. Compare Everywhere.
          </span>
        </motion.div>

        {/* Large Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-whiteAccent max-w-4xl leading-tight"
        >
          Stop searching. <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purpleAccent via-cyanAccent to-whiteAccent">
            Start saving.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-mutedText max-w-2xl mt-6 leading-relaxed"
        >
          Compare shoe prices across multiple online stores instantly. Find the model you want at the absolute best deal.
        </motion.p>

        {/* Large Search Bar */}
        <motion.form 
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-3xl mt-10"
        >
          <div className="relative p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md focus-within:border-purpleAccent/50 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-all duration-300 flex items-center">
            <Search size={22} className="text-mutedText ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for shoes, brands or models (e.g. Nike Air Max 270)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-whiteAccent placeholder-mutedText px-3 py-3.5 focus:outline-none text-sm md:text-base"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purpleAccent to-cyanAccent hover:from-purpleAccent/90 hover:to-cyanAccent/90 text-whiteAccent font-bold text-sm md:text-base px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purpleAccent/25 hover:shadow-cyanAccent/25 active:scale-[0.98] flex items-center space-x-2"
            >
              <span>Compare Prices</span>
            </button>
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs text-mutedText mt-4 font-semibold">
            <span>• Compare prices</span>
            <span>• Check deals</span>
            <span>• Save money</span>
          </div>
        </motion.form>
      </section>

      {/* Trending Shoes */}
      <section className="relative">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-whiteAccent flex items-center gap-2">
              <TrendingUp size={24} className="text-purpleAccent" />
              <span>Trending Shoes</span>
            </h2>
            <p className="text-sm text-mutedText mt-1">Popular sneaker models compared this week</p>
          </div>
          <Link to="/compare" className="text-sm text-cyanAccent hover:text-whiteAccent font-semibold flex items-center transition-colors">
            <span>View All</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card rounded-2xl h-80 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingShoes.map((shoe) => (
              <Link 
                to={`/product/${shoe.sku}`} 
                key={shoe.sku}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full border border-white/5"
              >
                <div className="relative aspect-video bg-[#0B1120] overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={shoe.image} 
                    alt={shoe.name} 
                    className="max-h-36 object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {shoe.bestDeal.discount >= 30 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow">
                      {shoe.bestDeal.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purpleAccent uppercase tracking-widest">{shoe.brand}</span>
                    <h3 className="text-sm font-bold text-whiteAccent line-clamp-1 mt-1 group-hover:text-cyanAccent transition-colors">
                      {shoe.model}
                    </h3>
                    <p className="text-xs text-mutedText mt-1 line-clamp-1">{shoe.name}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-mutedText">Best Deal Price</p>
                      <p className="text-base font-black text-bestDeal">₹{shoe.bestDeal.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] px-1.5 py-0.5 bg-white/5 text-mutedText rounded font-bold">{shoe.bestDeal.store}</span>
                      <p className="text-[9px] text-mutedText line-through mt-0.5">₹{shoe.originalPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Today's Best Deals */}
      <section className="relative">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-whiteAccent flex items-center gap-2">
              <Award size={24} className="text-bestDeal" />
              <span>Today's Best Deals</span>
            </h2>
            <p className="text-sm text-mutedText mt-1">Sneakers with the absolute highest markdown discount rates</p>
          </div>
          <Link to="/compare?sort=highestDiscount" className="text-sm text-cyanAccent hover:text-whiteAccent font-semibold flex items-center transition-colors">
            <span>View All Deals</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card rounded-2xl h-96 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestDeals.map((shoe) => {
              const savings = shoe.originalPrice - shoe.bestDeal.price;
              return (
                <div 
                  key={shoe.sku}
                  className="glass-card rounded-2xl border border-bestDeal/20 overflow-hidden flex flex-col group bg-gradient-to-b from-bestDeal/[0.02] to-transparent"
                >
                  <div className="relative aspect-video bg-[#0B1120] overflow-hidden flex items-center justify-center p-6 border-b border-white/5">
                    <img 
                      src={shoe.image} 
                      alt={shoe.name} 
                      className="max-h-40 object-contain transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <BestDealBadge />
                    </div>
                    <div className="absolute top-4 right-4 bg-bestDeal text-[#030712] font-black text-xs px-2.5 py-1 rounded-lg shadow-lg">
                      {shoe.bestDeal.discount}% OFF
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyanAccent uppercase tracking-widest">{shoe.brand}</span>
                        <span className="text-[10px] text-mutedText flex items-center"><Clock size={10} className="mr-1" /> Live Price</span>
                      </div>
                      <h3 className="text-lg font-black text-whiteAccent mt-2 group-hover:text-purpleAccent transition-colors">
                        {shoe.name}
                      </h3>
                      <p className="text-xs text-mutedText mt-1">Available sizes: {shoe.sizes.join(', ')}</p>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-mutedText uppercase tracking-wider">Cheapest At {shoe.bestDeal.store}</span>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-2xl font-black text-whiteAccent">₹{shoe.bestDeal.price.toLocaleString('en-IN')}</span>
                          <span className="text-sm text-mutedText line-through">₹{shoe.originalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <span className="text-xs text-bestDeal font-extrabold">Save ₹{savings.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <Link 
                        to={`/product/${shoe.sku}`}
                        className="p-3 bg-gradient-to-r from-purpleAccent to-blueAccent rounded-xl text-whiteAccent hover:scale-105 active:scale-95 transition-all shadow-md shadow-purpleAccent/25"
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Popular Brands */}
      <section className="text-center py-8">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-whiteAccent mb-2">Popular Brands</h2>
        <p className="text-sm text-mutedText mb-10">Direct filter comparisons by brand catalog</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {popularBrands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => handleBrandClick(brand.name)}
              className="glass-card px-8 py-5 rounded-2xl flex items-center space-x-3 text-whiteAccent hover:border-cyanAccent/40 hover:scale-105 active:scale-98 border border-white/5 min-w-[140px] justify-center"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purpleAccent/20 to-cyanAccent/20 flex items-center justify-center font-black text-cyanAccent text-sm">
                {brand.logo}
              </div>
              <span className="font-bold tracking-wide text-sm">{brand.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-[#0B1120]/20 pointer-events-none -z-10" />
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-whiteAccent">How SoleDeal Works</h2>
          <p className="text-sm text-mutedText mt-2">Get the absolute best rate on your next pair of kicks in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Search your shoe', desc: 'Type in the brand name, model or style of shoe you are searching for.' },
            { step: '02', title: 'Compare prices', desc: 'We compile all live matching offers across sneaker platforms and shopping websites.' },
            { step: '03', title: 'Pick the best deal', desc: 'We calculate a custom Deal Score and highlight the absolute cheapest option automatically.' },
            { step: '04', title: 'Buy from the store', desc: 'Click View Deal and redirect directly to the store checkout to lock in your discount.' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
              <span className="absolute top-4 right-4 text-4xl font-black text-white/5 group-hover:text-purpleAccent/10 transition-colors">
                {item.step}
              </span>
              <div className="w-10 h-10 rounded-xl bg-purpleAccent/10 border border-purpleAccent/25 flex items-center justify-center text-purpleAccent font-black mb-4">
                {idx + 1}
              </div>
              <h3 className="text-base font-extrabold text-whiteAccent">{item.title}</h3>
              <p className="text-xs text-mutedText mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why SoleDeal? */}
      <section id="why-soledeal" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
        <div>
          <span className="text-xs font-bold text-cyanAccent uppercase tracking-widest">Platform Advantages</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-whiteAccent mt-2">
            Why use SoleDeal comparison tool?
          </h2>
          <p className="text-sm text-mutedText mt-4 max-w-lg leading-relaxed">
            Finding shoes shouldn't mean open browser tabs across 10 websites checking prices. We aggregate the details so you make the best choice instantly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="flex space-x-3">
              <div className="p-2 h-10 w-10 rounded-xl bg-cyanAccent/10 text-cyanAccent flex items-center justify-center flex-shrink-0"><Compass size={18} /></div>
              <div>
                <h4 className="text-sm font-bold text-whiteAccent">Compare multiple stores</h4>
                <p className="text-xs text-mutedText mt-1">Cross-check listings from top e-commerce hubs automatically.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="p-2 h-10 w-10 rounded-xl bg-purpleAccent/10 text-purpleAccent flex items-center justify-center flex-shrink-0"><DollarSign size={18} /></div>
              <div>
                <h4 className="text-sm font-bold text-whiteAccent">Find cheaper prices</h4>
                <p className="text-xs text-mutedText mt-1">Instantly spotlight markdowns and coupon differentials.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="p-2 h-10 w-10 rounded-xl bg-bestDeal/10 text-bestDeal flex items-center justify-center flex-shrink-0"><Clock size={18} /></div>
              <div>
                <h4 className="text-sm font-bold text-whiteAccent">Save shopping time</h4>
                <p className="text-xs text-mutedText mt-1">Get comparison tables immediately in under 5 seconds.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="p-2 h-10 w-10 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center flex-shrink-0"><ArrowDownRight size={18} /></div>
              <div>
                <h4 className="text-sm font-bold text-whiteAccent">Track price changes</h4>
                <p className="text-xs text-mutedText mt-1">Trace historic values and calculate current score positions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Showcase Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-tr from-purpleAccent/5 via-cyanAccent/[0.02] to-transparent">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purpleAccent/10 blur-3xl rounded-full" />
          
          <div className="flex justify-between items-center pb-6 border-b border-white/5">
            <div>
              <span className="text-[10px] font-bold text-purpleAccent uppercase tracking-widest">Featured Comparison</span>
              <h3 className="text-lg font-black text-whiteAccent mt-1">Nike Air Max 270</h3>
            </div>
            <BestDealBadge />
          </div>

          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-bestDeal/5 border border-bestDeal/30">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-bestDeal animate-ping" />
                <span className="text-sm font-extrabold text-whiteAccent">SoleStore</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-bestDeal">₹7,999</span>
                <span className="block text-[9px] text-mutedText font-semibold">Free Delivery</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 opacity-70">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span className="text-sm font-bold text-mutedText">FootPulse</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-whiteAccent">₹8,499</span>
                <span className="block text-[9px] text-mutedText font-semibold">+ ₹49 Delivery</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 opacity-55">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span className="text-sm font-bold text-mutedText">SneakerSphere</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-whiteAccent">₹9,199</span>
                <span className="block text-[9px] text-mutedText font-semibold">Free Delivery</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-center text-xs text-mutedText">
            <span className="text-bestDeal font-extrabold">Save up to ₹1,200</span> in direct shop margins.
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative rounded-3xl p-8 md:p-16 border border-white/10 overflow-hidden text-center bg-gradient-to-tr from-purpleAccent/10 via-background to-cyanAccent/5 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none" />
        
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-whiteAccent max-w-2xl mx-auto">
          Your next pair might be cheaper somewhere else.
        </h2>
        <p className="text-sm md:text-base text-mutedText max-w-md mx-auto mt-4 leading-relaxed">
          Stop overpaying. Scan 1,000+ shoes and stores in seconds and find your SoleDeal.
        </p>

        <div className="mt-8">
          <Link
            to="/compare"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purpleAccent to-cyanAccent hover:from-purpleAccent/90 hover:to-cyanAccent/90 text-whiteAccent font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-purpleAccent/25 hover:shadow-cyanAccent/25 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Compare Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
