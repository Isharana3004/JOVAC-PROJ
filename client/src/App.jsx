import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundStars from './components/BackgroundStars';
import Home from './pages/Home';
import Search from './pages/Search';
import ProductDetails from './pages/ProductDetails';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-background text-slate-100 flex flex-col overflow-x-hidden selection:bg-purpleAccent/30 selection:text-cyanAccent">
        {/* Animated Twinkling Starfield canvas in background */}
        <BackgroundStars />

        {/* Global ambient glow backdrops */}
        <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-glow-purple -z-40 pointer-events-none opacity-65" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-glow-blue -z-40 pointer-events-none opacity-50" />
        <div className="fixed top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-glow-cyan -z-40 pointer-events-none opacity-30" />

        {/* Header Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-grow pt-24 pb-16 px-4 max-w-7xl mx-auto w-full z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compare" element={<Search />} />
            <Route path="/product/:sku" element={<ProductDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
