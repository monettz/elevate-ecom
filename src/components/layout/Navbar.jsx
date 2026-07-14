import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Globe, ChevronDown, Phone, Home, Store, Tag, HelpCircle, Package, LogOut } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../../store/useStore';
import { useDataStore } from '../../store/useDataStore';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  const cartCount = useCartStore((state) => state.cart.reduce((total, item) => total + item.quantity, 0));
  const wishlistCount = useWishlistStore((state) => state.wishlist.length);
  const { categories, products } = useDataStore();
  const { user, isSignedIn, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = searchQuery.trim() 
    ? (products || []).filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <>
      {/* Spacer to prevent layout shift when header becomes fixed */}
      <div className="h-[73px] md:h-[125px] w-full shrink-0"></div>

      <header className={`fixed top-0 left-0 right-0 z-[100] w-full bg-white transition-all duration-300 ${isScrolled ? 'shadow-md border-b border-gray-200' : 'border-b border-border shadow-sm'}`}>
        {/* Main Navbar */}
        <div className="px-4 py-4 max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-primary hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands and more..." 
            className="w-full bg-gray-100 border-none rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors">
            <Search size={20} />
          </button>
          
          {/* Desktop Live Search Dropdown */}
          {searchQuery.trim() && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <ul className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
                  {searchResults.slice(0, 5).map(product => (
                    <li key={product.id}>
                      <Link 
                        to={`/product/${product.id}`}
                        onClick={() => { setSearchQuery(""); setIsMobileSearchOpen(false); }}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          TZS {Number(product.price).toLocaleString()}
                        </div>
                      </Link>
                    </li>
                  ))}
                  {searchResults.length > 5 && (
                    <li>
                      <button 
                        type="button"
                        onClick={handleSearch}
                        className="w-full text-center py-3 text-sm font-bold text-primary hover:bg-gray-50 transition-colors border-t border-gray-100"
                      >
                        View all {searchResults.length} results
                      </button>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-6 text-gray-700">
          <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="md:hidden hover:text-primary transition"><Search size={24} /></button>
          <div className="hidden md:flex items-center justify-center">
            {isSignedIn ? (
              <Link to="/profile" className="flex flex-col items-center hover:text-primary transition">
                <div className="w-6 h-6 bg-primary text-white rounded-full overflow-hidden flex items-center justify-center text-xs font-bold shadow-sm">
                  {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Profile" /> : (user?.user_metadata?.first_name ? user.user_metadata.first_name.charAt(0) : 'U')}
                </div>
                <span className="text-xs font-medium mt-1">Profile</span>
              </Link>
            ) : (
              <Link to="/login" className="flex flex-col items-center hover:text-primary transition">
                <User size={24} />
                <span className="text-xs font-medium mt-1">Sign In</span>
              </Link>
            )}
          </div>
          
          <Link to="/wishlist" className="relative flex flex-col items-center hover:text-primary transition">
            <Heart size={24} />
            <span className="hidden md:block text-xs font-medium mt-1">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="relative flex flex-col items-center hover:text-primary transition">
            <ShoppingCart size={24} />
            <span className="hidden md:block text-xs font-medium mt-1">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Categories Navigation - Desktop */}
      <nav className="hidden md:block border-t border-border">
        <ul className="flex items-center justify-center space-x-8 px-4 py-3 text-sm font-medium text-gray-700">
          <li className="relative group">
            <Link to="/shop" className="flex items-center hover:text-primary transition">
              <Menu size={16} className="mr-2" /> All Categories
            </Link>
          </li>
          {categories?.slice(0, 7).map(cat => (
            <li key={cat.id}>
              <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="hover:text-primary transition">{cat.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Search Bar Dropdown */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 absolute w-full left-0 z-40 shadow-sm">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="w-full bg-gray-100 border-none rounded-full py-2.5 px-5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={18} />
            </button>
            
            {/* Mobile Live Search Dropdown */}
            {searchQuery.trim() && (
              <div className="absolute top-full mt-3 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <ul className="max-h-[50vh] overflow-y-auto py-1">
                    {searchResults.slice(0, 5).map(product => (
                      <li key={product.id}>
                        <Link 
                          to={`/product/${product.id}`}
                          onClick={() => { setSearchQuery(""); setIsMobileSearchOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                        >
                          <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                            <div className="flex justify-between items-center mt-0.5">
                              <p className="text-xs text-gray-500">{product.category}</p>
                              <p className="text-xs font-bold text-gray-900">TZS {Number(product.price).toLocaleString()}</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                    {searchResults.length > 5 && (
                      <li>
                        <button 
                          type="button"
                          onClick={handleSearch}
                          className="w-full text-center py-3 text-sm font-bold text-primary hover:bg-gray-50 transition-colors bg-gray-50/50"
                        >
                          View all {searchResults.length} results
                        </button>
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="p-5 text-center text-gray-500 text-sm">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`md:hidden fixed inset-0 z-[200] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer Panel */}
        <div 
          className={`absolute top-0 left-0 w-[85%] max-w-[340px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header */}
          <div className="bg-primary pt-12 pb-8 px-6 relative overflow-hidden flex-shrink-0 rounded-br-[2.5rem]">
            <button 
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
            
            {user ? (
              <div className="flex flex-col items-start text-white">
                <div className="w-16 h-16 bg-white text-primary rounded-full overflow-hidden flex items-center justify-center text-xl font-bold shadow-md mb-3 border-2 border-white/20">
                  {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : (user?.user_metadata?.first_name ? user.user_metadata.first_name.charAt(0) : 'U')}
                </div>
                <div className="font-bold text-xl truncate w-full">{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</div>
                <div className="text-white/80 text-sm mt-0.5 truncate w-full">{user?.email}</div>
              </div>
            ) : (
              <div className="flex flex-col items-start text-white">
                <div className="w-16 h-16 bg-white/20 text-white rounded-full overflow-hidden flex items-center justify-center shadow-inner mb-3">
                  <User size={32} />
                </div>
                <div className="font-bold text-xl">Guest User</div>
                <div className="text-white/80 text-sm mt-0.5">Sign in for a better experience</div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar bg-white">
            <div className="space-y-1 mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Navigation</h3>
              <Link to="/" className="flex items-center gap-4 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Home size={20} className="text-gray-400" /> Home
              </Link>
              <Link to="/shop" className="flex items-center gap-4 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Store size={20} className="text-gray-400" /> Shop All
              </Link>
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Categories</h3>
              {categories?.slice(0, 6).map(cat => (
                <Link key={cat.id} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-4 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <Tag size={20} className="text-gray-400" /> <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Profile & Help</h3>
              {user ? (
                <Link to="/profile" className="flex items-center gap-4 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={20} className="text-gray-400" /> My Account
                </Link>
              ) : (
                <Link to="/login" className="flex items-center gap-4 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={20} className="text-gray-400" /> Sign In / Register
                </Link>
              )}
              <Link to="/order-tracking" className="flex items-center gap-4 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Package size={20} className="text-gray-400" /> Track Order
              </Link>
              <Link to="/contact" className="flex items-center gap-4 px-3 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <HelpCircle size={20} className="text-gray-400" /> Support
              </Link>
            </div>
          </div>
          
          {/* Footer Actions */}
          {user && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <button 
                onClick={() => { signOut(); setIsMobileMenuOpen(false); navigate('/'); }} 
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  );
}
