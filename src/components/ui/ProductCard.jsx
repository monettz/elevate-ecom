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
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <Link to={`/product/${product.id}`} className="block relative">
        {/* Badges */}
        <div className="absolute top-0 left-0 z-10 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              {product.badge}
            </span>
          )}
          {product.is_new && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-0 right-0 z-10 p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
        </button>

        {/* Image */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md">
              <Eye size={16} /> Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 mb-1">{product.category}</div>
          
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight h-10">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900">TZS {Number(product.price || 0).toFixed(2)}</span>
              {product.old_price && (
                <span className="text-xs text-gray-400 line-through">TZS {Number(product.old_price).toFixed(2)}</span>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
