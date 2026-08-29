function Navbar({ wishlistCount, onOpenWishlist, currentUser, onOpenAuth, onLogout }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
<div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
  {/* Logo */}
  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-lg sm:text-xl text-white transition-colors duration-200 group-hover:bg-indigo-500">
    👟
  </div>

  {/* Brand */}
  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap transition-colors duration-200 group-hover:text-indigo-300">
    Sole<span className="text-indigo-400 group-hover:text-indigo-200">Deal</span>
  </span>
</div>



        {/* Subtitle */}
        <div className="hidden lg:block text-xs font-medium text-slate-400 bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-800">
          Compare shoe prices across <span className="text-amber-400 font-semibold">Amazon</span>, <span className="text-blue-400 font-semibold">Flipkart</span> & <span className="text-rose-400 font-semibold">Myntra</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 active:scale-95"
          >
            <span className="text-rose-400">❤️</span>
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-1.5 pl-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden sm:block text-left pr-2">
                  <p className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[100px]">
                    Signed in
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-rose-950/50 hover:text-rose-400"
              >
                🚪
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
            >
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
