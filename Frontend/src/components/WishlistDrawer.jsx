function WishlistDrawer({ isOpen, onClose, wishlist, onRemoveItem, onClearWishlist, currentUser, onOpenAuth }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-slate-900 text-white shadow-2xl border-l border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-400 text-base font-bold">
                ❤️
              </div>
              <div>
                <h2 className="text-lg font-bold">My Wishlist</h2>
                <p className="text-xs text-slate-400">
                  {currentUser ? `${currentUser.name}'s saved items` : "Saved deals"} ({wishlist.length})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!currentUser ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="text-5xl mb-3">🔒</div>
                <h3 className="text-lg font-bold text-slate-200">Sign in to view your wishlist</h3>
                <p className="mt-2 text-xs text-slate-400 max-w-xs">
                  Please log in or register an account to view and manage your saved shoe deals.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="mt-5 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500"
                >
                  Sign In / Register
                </button>
              </div>
            ) : wishlist.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="text-5xl mb-3">👟</div>
                <h3 className="text-lg font-bold text-slate-200">Your wishlist is empty</h3>
                <p className="mt-2 text-xs text-slate-400 max-w-xs">
                  Click the heart icon on any shoe deal to save it to your wishlist.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                >
                  Browse Shoes
                </button>
              </div>
            ) : (
              wishlist.map((item) => {
                let platformBadge = "bg-slate-800 text-slate-300 border-slate-700";
                const pLower = (item.platform || "").toLowerCase();
                if (pLower.includes("amazon")) {
                  platformBadge = "bg-amber-950/40 text-amber-300 border-amber-800/60";
                } else if (pLower.includes("flipkart")) {
                  platformBadge = "bg-blue-950/40 text-blue-300 border-blue-800/60";
                } else if (pLower.includes("myntra")) {
                  platformBadge = "bg-rose-950/40 text-rose-300 border-rose-800/60";
                }

                return (
                  <div
                    key={item.id}
                    className="relative group rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700"
                  >
                    <div className="flex gap-4 items-center">
                      {/* Image */}
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white p-2 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-2xl">👟</span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${platformBadge}`}>
                            {item.platform || "SoleDeal"}
                          </span>
                          {item.discount > 0 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                              {item.discount}% OFF
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-semibold text-slate-100 truncate" title={item.name}>
                          {item.name || item.productName}
                        </h4>

                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm font-bold text-indigo-400">
                            ₹{item.price || item.bestPrice}
                          </span>
                          {item.mrp > item.price && (
                            <span className="text-[11px] text-slate-500 line-through">
                              ₹{item.mrp}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        title="Remove from wishlist"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-rose-950/60 hover:text-rose-400"
                      >
                        🗑️
                      </button>
                    </div>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block text-center rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
                      >
                        View Deal →
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {currentUser && wishlist.length > 0 && (
            <div className="border-t border-slate-800 p-4 bg-slate-950/40 flex items-center justify-between">
              <button
                onClick={onClearWishlist}
                className="text-xs font-medium text-slate-400 transition hover:text-rose-400"
              >
                Clear Wishlist
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishlistDrawer;
