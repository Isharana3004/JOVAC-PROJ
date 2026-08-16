import React from 'react';
import { Percent, ShieldCheck, Truck, Star, Award } from 'lucide-react';

export default function DealScoreGauge({ score = 70 }) {
  // Determine color and label based on score
  const getScoreDetails = (val) => {
    if (val >= 90) return { label: 'Excellent Deal', colorClass: 'text-bestDeal', borderClass: 'border-bestDeal/20', bgClass: 'bg-bestDeal/5', gradient: 'from-green-500 to-emerald-400' };
    if (val >= 75) return { label: 'Great Deal', colorClass: 'text-emerald-400', borderClass: 'border-emerald-500/20', bgClass: 'bg-emerald-500/5', gradient: 'from-emerald-400 to-teal-400' };
    if (val >= 60) return { label: 'Good Deal', colorClass: 'text-cyan-400', borderClass: 'border-cyan-500/20', bgClass: 'bg-cyan-500/5', gradient: 'from-cyan-400 to-blue-500' };
    if (val >= 45) return { label: 'Fair Deal', colorClass: 'text-yellow-400', borderClass: 'border-yellow-500/20', bgClass: 'bg-yellow-500/5', gradient: 'from-yellow-400 to-amber-500' };
    return { label: 'Average Deal', colorClass: 'text-slate-400', borderClass: 'border-slate-500/20', bgClass: 'bg-slate-500/5', gradient: 'from-slate-400 to-gray-500' };
  };

  const details = getScoreDetails(score);

  // SVG calculations for circle progress
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (score / 100) * circumference;

  return (
    <div className={`glass-card p-6 rounded-2xl border ${details.borderClass} ${details.bgClass} flex flex-col md:flex-row items-center gap-6 w-full`}>
      {/* Gauge Visual */}
      <div className="relative flex items-center justify-center w-28 h-28 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Base track circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={`url(#gaugeGradient-${score})`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          {/* Define gradient */}
          <defs>
            <linearGradient id={`gaugeGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="stop-color-purpleAccent" style={{ stopColor: '#8B5CF6' }} />
              <stop offset="100%" style={{ stopColor: score >= 90 ? '#22C55E' : '#22D3EE' }} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Central text overlay */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-whiteAccent leading-none">{score}</span>
          <span className="text-[10px] text-mutedText tracking-widest font-semibold uppercase mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Details & Explanation */}
      <div className="flex-grow text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-2">
          <span className={`text-xl font-extrabold tracking-wide ${details.colorClass}`}>{details.label}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 rounded-md text-mutedText">Calculated Score</span>
        </div>
        <p className="text-sm text-mutedText mt-2 max-w-md">
          This score evaluates product value by grading the listing price, discount scale, delivery fees, and seller credibility.
        </p>

        {/* Factors Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5 text-left">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-white/5 text-purpleAccent"><Award size={14} /></div>
            <div className="flex flex-col">
              <span className="text-xs text-whiteAccent font-semibold">Price Rank</span>
              <span className="text-[10px] text-mutedText">Cheapest store</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-white/5 text-cyanAccent"><Percent size={14} /></div>
            <div className="flex flex-col">
              <span className="text-xs text-whiteAccent font-semibold">Discount</span>
              <span className="text-[10px] text-mutedText">Markdown %</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-white/5 text-bestDeal"><Truck size={14} /></div>
            <div className="flex flex-col">
              <span className="text-xs text-whiteAccent font-semibold">Delivery</span>
              <span className="text-[10px] text-mutedText">Shipping fees</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-white/5 text-yellow-400"><Star size={14} /></div>
            <div className="flex flex-col">
              <span className="text-xs text-whiteAccent font-semibold">Store Rating</span>
              <span className="text-[10px] text-mutedText">Seller trust</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
