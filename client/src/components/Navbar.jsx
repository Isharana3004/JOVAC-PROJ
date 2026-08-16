import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowDown, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: 'Deals', path: '/compare?sort=highestDiscount' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/#why-soledeal' }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-lg border-white/5 py-4' 
        : 'bg-transparent border-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purpleAccent to-cyanAccent p-[1px] shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0B1120] rounded-xl flex items-center justify-center relative overflow-hidden">
                <Tag size={18} className="text-purpleAccent group-hover:text-cyanAccent transition-colors duration-300" />
                <ArrowDown size={10} className="absolute bottom-1 right-1 text-cyanAccent group-hover:text-whiteAccent transition-colors duration-300 stroke-[3px]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-whiteAccent via-whiteAccent to-purpleAccent group-hover:from-whiteAccent group-hover:via-cyanAccent group-hover:to-purpleAccent transition-all duration-500">
                Sole<span className="text-cyanAccent font-extrabold">Deal</span>
              </span>
              <span className="text-[9px] text-mutedText tracking-widest uppercase font-semibold leading-none group-hover:text-whiteAccent transition-colors duration-300">
                Compare prices
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                               (link.path.startsWith('/#') && location.pathname === '/');
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 hover:text-whiteAccent ${
                    isActive ? 'text-cyanAccent' : 'text-mutedText'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-purpleAccent to-cyanAccent rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            
            <Link 
              to="/compare" 
              className="ml-4 px-5 py-2 rounded-xl text-sm font-semibold text-whiteAccent bg-gradient-to-r from-purpleAccent to-blueAccent hover:from-purpleAccent/90 hover:to-blueAccent/90 shadow-md shadow-purpleAccent/25 hover:shadow-cyanAccent/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center space-x-1.5"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Compare Now</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-mutedText hover:text-whiteAccent focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-secondary/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-mutedText hover:text-whiteAccent hover:bg-white/5 transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-3">
                <Link
                  to="/compare"
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-base font-semibold text-whiteAccent bg-gradient-to-r from-purpleAccent to-blueAccent shadow-lg shadow-purpleAccent/20"
                >
                  <Sparkles size={16} className="mr-2" />
                  Compare Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
