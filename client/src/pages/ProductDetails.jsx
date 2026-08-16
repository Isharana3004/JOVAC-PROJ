import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Shield, Truck, Star, Info, TrendingDown, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import DealScoreGauge from '../components/DealScoreGauge';
import BestDealBadge from '../components/BestDealBadge';

export default function ProductDetails() {
  const { sku } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const data = await api.getProductDetails(sku);
        setShoe(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load shoe comparison details.');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [sku]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pt-8">
        <div className="h-6 w-32 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-96 bg-white/5 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-10 w-2/3 bg-white/5 rounded-xl" />
            <div className="h-6 w-1/3 bg-white/5 rounded-lg" />
            <div className="h-28 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !shoe) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-bold text-whiteAccent">{error || 'Shoe comparison details not found'}</p>
        <Link to="/compare" className="mt-6 inline-flex items-center space-x-2 text-cyanAccent hover:underline">
          <ArrowLeft size={16} />
          <span>Back to compare list</span>
        </Link>
      </div>
    );
  }

  const bestDeal = shoe.bestDeal;
  const bestSavings = shoe.originalPrice - bestDeal.price;
  
  // Custom SVG line chart plotting coordinates
  const renderPriceHistoryChart = () => {
    if (!shoe.priceHistory || shoe.priceHistory.length === 0) return null;
    
    const width = 500;
    const height = 150;
    const padding = 35;
    
    // Find min/max prices to scale Y axis
    const prices = shoe.priceHistory.map(item => item.price);
    const maxVal = Math.max(...prices, shoe.originalPrice);
    const minVal = Math.min(...prices) * 0.95; // 5% padding below min
    const range = maxVal - minVal;
    
    // Convert points to coordinates
    const points = shoe.priceHistory.map((item, idx) => {
      const x = padding + (idx * (width - 2 * padding)) / (shoe.priceHistory.length - 1);
      // Invert Y coordinate since SVG (0,0) is top-left
      const y = height - padding - ((item.price - minVal) / range) * (height - 2 * padding);
      return { x, y, label: item.date, price: item.price };
    });
    
    // Construct SVG path string
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    return (
      <div className="relative p-6 rounded-2xl glass-card border border-white/5 mt-8 overflow-hidden bg-[#0B1120]/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={12} className="text-cyanAccent" />
              <span>Historic Price Progression</span>
            </h4>
            <span className="text-[10px] text-mutedText">Automatic tracking graph (4 month window)</span>
          </div>
          <span className="text-xs font-extrabold text-bestDeal bg-bestDeal/10 border border-bestDeal/20 px-2 py-0.5 rounded">
            Lowest price found: ₹{minVal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* SVG Drawing */}
        <div className="w-full overflow-x-auto">
          <svg className="w-full min-w-[450px]" height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
                <stop offset="100%" style={{ stopColor: '#22D3EE' }} />
              </linearGradient>
            </defs>
            
            {/* Gridlines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Main Path line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#chartGradient)"
              strokeWidth="4"
              className="chart-line"
            />
            
            {/* Coordinates circular node points */}
            {points.map((pt, idx) => (
              <g key={idx} className="chart-point group/point cursor-pointer">
                {/* Outer ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill="#030712"
                  stroke={idx === points.length - 1 ? '#22C55E' : '#8B5CF6'}
                  strokeWidth="3"
                />
                {/* Floating tooltip */}
                <text
                  x={pt.x}
                  y={pt.y - 14}
                  textAnchor="middle"
                  className="fill-whiteAccent text-[10px] font-black"
                >
                  ₹{pt.price.toLocaleString('en-IN')}
                </text>
                
                {/* Label Date */}
                <text
                  x={pt.x}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-mutedText text-[9px] font-bold"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Back button */}
      <div>
        <Link 
          to="/compare" 
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-mutedText hover:text-cyanAccent transition-colors duration-200"
        >
          <ArrowLeft size={14} />
          <span>Back to compare engine</span>
        </Link>
      </div>

      {/* Main product overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Product Image Display */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 flex items-center justify-center bg-[#0B1120]/45 relative overflow-hidden group min-h-[350px] md:min-h-[450px]">
          <div className="absolute top-4 left-4">
            <BestDealBadge />
          </div>
          <div className="absolute top-4 right-4 bg-purpleAccent/10 border border-purpleAccent/30 text-purpleAccent font-black text-xs px-3 py-1 rounded-xl">
            {shoe.category}
          </div>
          <img 
            src={shoe.image} 
            alt={shoe.name} 
            className="max-h-72 md:max-h-96 object-contain transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Side: Primary metadata */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-purpleAccent uppercase tracking-widest">{shoe.brand}</span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-whiteAccent mt-1">{shoe.model}</h1>
            <p className="text-sm text-mutedText mt-1.5">{shoe.name}</p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-mutedText">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(shoe.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="font-bold text-whiteAccent">{shoe.rating} / 5.0</span>
            <span>• Verified Buyers Feedback</span>
          </div>

          {/* Pricing Highlight panel */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] text-mutedText uppercase tracking-wider block">Best Price Guaranteed</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black text-bestDeal">₹{bestDeal.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-mutedText line-through">₹{shoe.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-xs font-extrabold text-bestDeal flex items-center gap-1 mt-1">
                <TrendingDown size={14} />
                <span>Save ₹{bestSavings.toLocaleString('en-IN')} ({bestDeal.discount}% off)</span>
              </span>
            </div>
            
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-mutedText uppercase tracking-wider block">Supplier Listing</span>
              <span className="inline-block mt-2 px-3 py-1 rounded bg-cyanAccent/10 border border-cyanAccent/25 text-xs font-black text-cyanAccent uppercase">
                {bestDeal.store}
              </span>
              <span className="block text-[9px] text-mutedText mt-1">Last updated: {new Date(shoe.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Sizes filter block */}
          <div>
            <span className="text-xs font-extrabold text-slate-300 uppercase tracking-widest block mb-2">Available UK Sizes</span>
            <div className="flex flex-wrap gap-2">
              {shoe.sizes.map(size => (
                <span 
                  key={size} 
                  className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl font-bold text-sm text-whiteAccent"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Custom Deal Score Gauge widget */}
          <DealScoreGauge score={shoe.dealScore} />
        </div>
      </div>

      {/* Price Comparison Block */}
      <section className="space-y-6 pt-6 border-t border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-whiteAccent">Compare Store Prices</h2>
          <p className="text-xs text-mutedText mt-1">Direct listing matches for {shoe.model} aggregated across marketplaces</p>
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-white/5 glass-card">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-mutedText font-extrabold text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Store Name</th>
                <th className="py-4 px-6 text-right">Price</th>
                <th className="py-4 px-6 text-right">Original Price</th>
                <th className="py-4 px-6 text-center">Discount</th>
                <th className="py-4 px-6 text-center">Delivery Cost</th>
                <th className="py-4 px-6 text-center">Store Trust</th>
                <th className="py-4 px-6 text-right">Deal Match</th>
              </tr>
            </thead>
            <tbody>
              {shoe.listings.map((item, idx) => {
                const isCheapest = item.price === bestDeal.price && item.store === bestDeal.store;
                
                return (
                  <tr 
                    key={idx} 
                    className={`border-b border-white/5 transition-colors duration-200 ${
                      isCheapest ? 'bg-bestDeal/[0.03] hover:bg-bestDeal/[0.05]' : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Store Title */}
                    <td className="py-4 px-6 font-extrabold text-whiteAccent flex items-center space-x-2">
                      <span className="text-slate-100">{item.store}</span>
                      {isCheapest && <span className="text-[9px] px-1.5 py-0.5 rounded bg-bestDeal/20 border border-bestDeal/45 text-bestDeal font-extrabold">CHEAPEST</span>}
                    </td>
                    {/* Price */}
                    <td className="py-4 px-6 text-right font-black text-whiteAccent">
                      <span className={isCheapest ? 'text-bestDeal text-base' : ''}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </td>
                    {/* Original Price */}
                    <td className="py-4 px-6 text-right text-mutedText line-through">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </td>
                    {/* Discount */}
                    <td className="py-4 px-6 text-center font-extrabold text-red-500">
                      {item.discount}% OFF
                    </td>
                    {/* Delivery */}
                    <td className="py-4 px-6 text-center text-slate-300 font-semibold">
                      {item.deliveryFee === 0 ? (
                        <span className="text-bestDeal">FREE</span>
                      ) : (
                        `₹${item.deliveryFee}`
                      )}
                    </td>
                    {/* Store rating */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/5 text-xs text-yellow-400 font-bold">
                        ★ {item.rating}
                      </span>
                    </td>
                    {/* Redirect link */}
                    <td className="py-4 px-6 text-right">
                      <a 
                        href={item.productUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold shadow transition-all duration-300 ${
                          isCheapest
                            ? 'bg-gradient-to-r from-purpleAccent to-cyanAccent text-[#030712] hover:shadow-cyanAccent/20 hover:scale-105'
                            : 'bg-white/5 hover:bg-white/10 text-whiteAccent border border-white/10'
                        }`}
                      >
                        <span>View Deal</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE STACKED CARDS VIEW (Responsive transformation) */}
        <div className="md:hidden space-y-4">
          {shoe.listings.map((item, idx) => {
            const isCheapest = item.price === bestDeal.price && item.store === bestDeal.store;
            
            return (
              <div 
                key={idx}
                className={`glass-card rounded-2xl p-5 border relative overflow-hidden flex flex-col ${
                  isCheapest ? 'border-bestDeal/30 bg-bestDeal/[0.02]' : 'border-white/5'
                }`}
              >
                {isCheapest && (
                  <div className="absolute top-0 right-0 bg-bestDeal text-[#030712] font-black text-[9px] px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                    Best Deal
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-mutedText uppercase tracking-wider block">Retail Store</span>
                    <span className="text-base font-black text-whiteAccent">{item.store}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-mutedText uppercase tracking-wider block">Seller Score</span>
                    <span className="text-xs text-yellow-400 font-extrabold">★ {item.rating} rating</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-mutedText">Final Price</span>
                    <p className={`font-black text-sm mt-0.5 ${isCheapest ? 'text-bestDeal' : 'text-whiteAccent'}`}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-mutedText">Original Price</span>
                    <p className="text-mutedText line-through mt-0.5">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-mutedText">Delivery</span>
                    <p className={`font-semibold mt-0.5 ${item.deliveryFee === 0 ? 'text-bestDeal' : 'text-slate-300'}`}>
                      {item.deliveryFee === 0 ? 'FREE' : `₹${item.deliveryFee}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <div className="text-red-500 font-extrabold text-xs">
                    {item.discount}% OFF discount
                  </div>
                  
                  <a 
                    href={item.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-extrabold ${
                      isCheapest 
                        ? 'bg-gradient-to-r from-purpleAccent to-cyanAccent text-[#030712]' 
                        : 'bg-white/5 border border-white/10 text-whiteAccent'
                    }`}
                  >
                    <span>View Deal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Render Price History Graph */}
      {renderPriceHistoryChart()}

      {/* Buying security banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-sm">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start space-x-3">
          <Shield size={18} className="text-purpleAccent mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-extrabold text-whiteAccent text-xs">100% Secure Checkout</h5>
            <p className="text-xs text-mutedText mt-0.5">We send you directly to the official merchant checkout sites.</p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start space-x-3">
          <Truck size={18} className="text-cyanAccent mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-extrabold text-whiteAccent text-xs">Accurate Delivery Cost</h5>
            <p className="text-xs text-mutedText mt-0.5">Delivery fees are integrated directly into our Best Deal scoring formulas.</p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start space-x-3">
          <Info size={18} className="text-bestDeal mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-extrabold text-whiteAccent text-xs">Independent Comparisons</h5>
            <p className="text-xs text-mutedText mt-0.5">Offers are scored neutrally by price, discount, and ratings math.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
