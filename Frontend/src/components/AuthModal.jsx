import { useState } from "react";
import { loginUser, registerUser } from "../utils/auth";

function AuthModal({ isOpen, onClose, onLoginSuccess, pendingWishlistItemNotice }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;
      if (isLoginTab) {
        user = await loginUser({ email, password });
      } else {
        user = await registerUser({ name, email, password });
      }
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || "Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLoginTab ? "Sign In to SoleDeal" : "Create Account"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {pendingWishlistItemNotice
              ? "Please sign in or register to save items to your wishlist."
              : isLoginTab
              ? "Enter your credentials to access your account & wishlist"
              : "Register to save deals and access your wishlist"}
          </p>
        </div>

        {/* Wishlist Login prompt notice */}
        {pendingWishlistItemNotice && (
          <div className="mb-4 rounded-xl border border-indigo-800/60 bg-indigo-950/40 p-3 text-xs text-indigo-300 flex items-center gap-2">
            <span className="text-base">🔒</span>
            <div>
              <strong className="block font-semibold">Sign in required:</strong>
              Log in or register now to add items to your wishlist.
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(true);
              setError("");
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition ${
              isLoginTab
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(false);
              setError("");
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition ${
              !isLoginTab
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-800/60 bg-rose-950/30 p-3 text-xs text-rose-300 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type Your Name"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isLoginTab
              ? "Sign In"
              : "Register Account"}
          </button>
        </form>

        
      </div>
    </div>
  );
}

export default AuthModal;
