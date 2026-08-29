function ComparisonCard({ comparison, wishlist = [], onToggleWishlist, currentUser }) {
  const offers = comparison.offers || [];

  const isWishlisted = (offer) => {
    const id = offer.id || `${offer.platform}_${offer.name}_${offer.price}`;
    return wishlist.some((item) => item.id === id);
  };

  const handleHeartClick = (e, offer) => {
    e.preventDefault();
    e.stopPropagation();
    const offerId = offer.id || `${offer.platform}_${offer.name}_${offer.price}`;
    onToggleWishlist({
      id: offerId,
      productName: comparison.productName,
      name: offer.name,
      platform: offer.platform,
      price: offer.price,
      mrp: offer.mrp,
      discount: offer.discount,
      image: offer.image,
      url: offer.url,
      rating: offer.rating,
      bestPrice: comparison.bestPrice,
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl transition hover:border-slate-700">

      {/* Product Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800 p-6 md:flex-row md:items-center md:justify-between bg-slate-950/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              ⚡ Lowest Deal Found
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {comparison.productName}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-center">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Best Price
            </p>
            <p className="text-2xl font-bold text-indigo-400">
              ₹{comparison.bestPrice}
            </p>
            <p className="text-xs text-slate-400">
              on <span className="text-slate-200 font-semibold">{comparison.bestPlatform}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Platform Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {offers.map((offer, index) => {
          const isBest = offer.platform === comparison.bestPlatform;
          const offerWishlisted = isWishlisted(offer);

          // Standard brand badges
          let platformBadge = "bg-slate-800 text-slate-300 border-slate-700";
          let viewBtnClass = "bg-slate-800 hover:bg-slate-700 text-white";

          const pLower = (offer.platform || "").toLowerCase();
          if (pLower.includes("amazon")) {
            platformBadge = "bg-amber-950/40 text-amber-300 border-amber-800/60";
          } else if (pLower.includes("flipkart")) {
            platformBadge = "bg-blue-950/40 text-blue-300 border-blue-800/60";
          } else if (pLower.includes("myntra")) {
            platformBadge = "bg-rose-950/40 text-rose-300 border-rose-800/60";
          }

          if (isBest) {
            viewBtnClass = "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20";
          }

          return (
            <div
              key={index}
              className={`relative p-6 flex flex-col justify-between ${
                isBest ? "bg-indigo-950/10" : "bg-slate-900"
              }`}
            >
              {/* Best badge */}
              {isBest && (
                <div className="absolute right-4 top-4 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                  BEST DEAL
                </div>
              )}

              <div>
                {/* Header: Badge & Wishlist Heart */}
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${platformBadge}`}>
                    {offer.platform}
                  </span>

                  <button
                    onClick={(e) => handleHeartClick(e, offer)}
                    title={
                      !currentUser
                        ? "Sign in to add to wishlist"
                        : offerWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                      offerWishlisted
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-rose-400"
                    }`}
                  >
                    {offerWishlisted ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="mb-5 flex h-44 items-center justify-center rounded-xl bg-white p-3">
                  {offer.image ? (
                    <img
                      src={offer.image}
                      alt={offer.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-5xl">👟</span>
                  )}
                </div>

                {/* Name */}
                <h4 className="font-medium text-slate-200 text-sm leading-snug line-clamp-2 min-h-[40px] mb-2">
                  {offer.name}
                </h4>

                {offer.rating > 0 && (
                  <div className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                    <span>★</span>
                    <span>{offer.rating}</span>
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="mt-4 border-t border-slate-800 pt-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">
                      ₹{offer.price}
                    </span>
                    {offer.mrp > offer.price && (
                      <span className="ml-2 text-xs text-slate-500 line-through">
                        ₹{offer.mrp}
                      </span>
                    )}
                  </div>

                  {offer.discount > 0 && (
                    <span className="text-xs font-semibold text-emerald-400">
                      {offer.discount}% OFF
                    </span>
                  )}
                </div>

                {offer.url && (
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 block rounded-xl py-2.5 text-center text-xs font-semibold transition ${viewBtnClass}`}
                  >
                    View Deal →
                  </a>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default ComparisonCard;