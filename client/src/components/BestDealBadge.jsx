import React from 'react';
import { Award } from 'lucide-react';

export default function BestDealBadge({ className = '' }) {
  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-bestDeal/10 text-bestDeal border border-bestDeal/35 shadow-md shadow-bestDeal/10 animate-pulse ${className}`}>
      <Award size={12} className="mr-1 stroke-[2.5]" />
      <span>Best Deal</span>
    </div>
  );
}
