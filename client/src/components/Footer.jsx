import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowDown, Shield, RefreshCw, Zap } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/5 bg-[#030712]/60 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-purpleAccent to-cyanAccent p-[1px]">
                <div className="w-full h-full bg-[#0B1120] rounded-lg flex items-center justify-center relative overflow-hidden">
                  <Tag size={14} className="text-purpleAccent" />
                  <ArrowDown size={8} className="absolute bottom-0.5 right-0.5 text-cyanAccent stroke-[3px]" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-wider text-whiteAccent">
                Sole<span className="text-cyanAccent font-extrabold">Deal</span>
              </span>
            </Link>
            <p className="text-sm text-mutedText max-w-sm">
              Search once. Compare everywhere. Find your SoleDeal. We help you scan online shoemakers and marketplaces to highlight the absolute lowest prices and best discounts in real-time.
            </p>
            <div className="flex space-x-6 text-xs text-mutedText pt-2">
              <div className="flex items-center"><Shield size={12} className="text-purpleAccent mr-1" /> 100% Secure</div>
              <div className="flex items-center"><RefreshCw size={12} className="text-cyanAccent mr-1" /> Live Updates</div>
              <div className="flex items-center"><Zap size={12} className="text-bestDeal mr-1" /> Fast Compare</div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-whiteAccent tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/compare" className="text-sm text-mutedText hover:text-cyanAccent transition-colors">Compare Shoes</Link>
              </li>
              <li>
                <Link to="/compare?sort=highestDiscount" className="text-sm text-mutedText hover:text-cyanAccent transition-colors">Hot Deals</Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm text-mutedText hover:text-cyanAccent transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/#why-soledeal" className="text-sm text-mutedText hover:text-cyanAccent transition-colors">Why Choose Us</Link>
              </li>
            </ul>
          </div>

          {/* About / Tech */}
          <div>
            <h3 className="text-sm font-semibold text-whiteAccent tracking-wider uppercase">Contact & Info</h3>
            <p className="mt-4 text-sm text-mutedText">
              SoleDeal is an independent price comparison service. All product logos, brands and trademarks are the property of their respective owners.
            </p>
            <button 
              onClick={scrollToTop}
              className="mt-4 text-xs font-semibold text-purpleAccent hover:text-cyanAccent transition-colors flex items-center"
            >
              Back to Top ↑
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-mutedText">
            &copy; {new Date().getFullYear()} SoleDeal Inc. Find the best price. Every time.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="text-xs text-mutedText hover:text-whiteAccent cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-mutedText hover:text-whiteAccent cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-xs text-mutedText hover:text-whiteAccent cursor-pointer transition-colors">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
