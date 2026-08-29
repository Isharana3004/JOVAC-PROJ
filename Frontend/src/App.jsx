import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import ComparisonCard from "./components/ComparisonCard";
import AuthModal from "./components/AuthModal";
import WishlistDrawer from "./components/WishlistDrawer";
import { getCurrentUser, logoutUser, API_BASE_URL } from "./utils/auth";

function App() {
  const [query, setQuery] = useState("");
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [pendingWishlistItem, setPendingWishlistItem] = useState(null);

  // User-specific Wishlist State (persisted per user)
  const [wishlist, setWishlist] = useState([]);

  // Load user wishlist whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      try {
        const key = `soledeal_wishlist_${currentUser.id}`;
        const saved = localStorage.getItem(key);
        setWishlist(saved ? JSON.parse(saved) : []);
      } catch {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  // Sync Wishlist to localStorage when wishlist or currentUser changes
  useEffect(() => {
    if (currentUser) {
      try {
        const key = `soledeal_wishlist_${currentUser.id}`;
        localStorage.setItem(key, JSON.stringify(wishlist));
      } catch (err) {
        console.error("Failed to save wishlist:", err);
      }
    }
  }, [wishlist, currentUser]);

  const searchProducts = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setError("Please enter a shoe name to compare prices");
      return;
    }

    setLoading(true);
    setError("");
    setComparisons([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch comparison results");
      }

      setComparisons(data.comparisons || []);
    } catch (err) {
      console.error("Search Error:", err);
      setError(
        err.message || "Unable to connect to backend service. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchProducts(query);
  };

  // Wishlist Action Handlers
  const handleToggleWishlist = (item) => {
    // REQUIREMENT: Must be logged in / registered to add items to wishlist
    if (!currentUser) {
      setPendingWishlistItem(item);
      setIsAuthModalOpen(true);
      return;
    }

    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === item.id);
      if (exists) {
        return prev.filter((w) => w.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const handleRemoveWishlistItem = (id) => {
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    
    // Automatically add pending item to wishlist after user registers or logs in!
    if (pendingWishlistItem) {
      try {
        const key = `soledeal_wishlist_${user.id}`;
        const saved = localStorage.getItem(key);
        const userWishlist = saved ? JSON.parse(saved) : [];
        
        const exists = userWishlist.some((w) => w.id === pendingWishlistItem.id);
        const updatedWishlist = exists
          ? userWishlist
          : [pendingWishlistItem, ...userWishlist];
          
        localStorage.setItem(key, JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
      } catch (err) {
        console.error("Error auto-adding wishlist item:", err);
      }
      setPendingWishlistItem(null);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setWishlist([]);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => {
          setPendingWishlistItem(null);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6">

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-16 md:py-24">
          
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5 text-xs font-semibold text-slate-300">
            <span className="text-amber-400">🏷️</span> Standard Shoe Price Comparison Platform
          </div>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Find the <span className="text-indigo-400">Best Price</span> for Your Favorite Shoes
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-400 font-normal">
            Search once and compare prices across <span className="text-amber-400 font-medium">Amazon</span>, <span className="text-blue-400 font-medium">Flipkart</span> and <span className="text-rose-400 font-medium">Myntra</span>.
          </p>

          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            loading={loading}
          />

        </section>

        {/* Error Notice */}
        {error && (
          <div className="mx-auto mb-8 max-w-2xl rounded-xl border border-rose-800/60 bg-rose-950/30 p-4 text-center text-rose-300 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-indigo-500" />
            <p className="mt-4 text-sm font-medium text-slate-400">
              Searching across platforms...
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && comparisons.length > 0 && (
          <section className="pb-20">
            <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Comparison Results
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Found {comparisons.length} matching sneaker models
                </p>
              </div>
            </div>

            <div className="grid gap-8">
              {comparisons.map((comparison, index) => (
                <ComparisonCard
                  key={index}
                  comparison={comparison}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && query && comparisons.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-5xl mb-3">👟</div>
            <h2 className="text-xl font-bold text-white">No matching shoes found</h2>
            <p className="mt-1 text-xs text-slate-400">
              Try searching for Nike, Adidas, Puma, or Jordan.
            </p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <span>👟</span>
            <span>SoleDeal</span>
          </div>
          <p>© {new Date().getFullYear()} SoleDeal — Compare shoe prices efficiently.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsWishlistOpen(true)} className="hover:text-slate-300 transition">
              Wishlist ({wishlist.length})
            </button>
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-slate-300 transition">
              Account
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingWishlistItem(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        pendingWishlistItemNotice={!!pendingWishlistItem}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveItem={handleRemoveWishlistItem}
        onClearWishlist={handleClearWishlist}
        currentUser={currentUser}
        onOpenAuth={() => {
          setPendingWishlistItem(null);
          setIsAuthModalOpen(true);
        }}
      />

    </div>
  );
}

export default App;