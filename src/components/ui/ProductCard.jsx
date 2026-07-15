import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore, useWishlistStore } from '../../store/useStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  
  const isWishlisted = wishlist.some(p => p.id === product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className="bg-card rounded-2xl p-3 border border-border shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full"
    >
      <div className="relative flex-shrink-0">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {product.is_new && (
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
        </button>

        {/* Image */}
        <Link to={`/product/${product.id}`} className="block relative aspect-square mb-2.5 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white text-gray-900 px-3 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md">
              <Eye size={14} /> Quick View
            </div>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow relative">
        <Link to={`/product/${product.id}`} className="flex flex-col flex-grow">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 font-medium">{product.category}</div>
          
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight mb-1">
            {product.name}
          </h3>

          {/* Spacer to push price down */}
          <div className="flex-grow"></div>
          
          <div className="flex items-end justify-between pt-2 mt-1">
            <div className="flex flex-col">
              {product.old_price && (
                <span className="text-[10px] text-gray-400 line-through leading-none mb-0.5">TZS {Number(product.old_price).toFixed(2)}</span>
              )}
              <span className="font-bold text-[15px] text-gray-900 leading-none tracking-tight">TZS {Number(product.price || 0).toFixed(2)}</span>
            </div>
          </div>
        </Link>

        {/* Floating Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
          aria-label="Add to cart"
        >
          <ShoppingCart size={15} />
        </button>
      </div>
    </motion.div>
  );
}
