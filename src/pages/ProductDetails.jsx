import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { useCartStore, useWishlistStore } from '../store/useStore';
import ProductCard from '../components/ui/ProductCard';
import { Star, Heart, Share2, ShoppingCart, ChevronRight, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useDataStore();
  const product = products.find(p => String(p.id) === String(id));
  
  const [quantity, setQuantity] = useState(1);
  
  const addToCart = useCartStore(state => state.addToCart);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const isWishlisted = product && wishlist.some(p => p.id === product.id);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    // In a real app, we might show a toast here
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    if (isWishlisted) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-900 font-medium truncate w-48 md:w-auto">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-border">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.badge && (
            <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-max mb-4">
              {product.badge}
            </span>
          )}
          
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-sm text-gray-500 underline cursor-pointer">{product.reviews} Reviews</span>
          </div>
          
          <div className="flex items-end gap-4 mb-6 pb-6 border-b border-border">
            <span className="text-4xl font-bold text-gray-900">TZS {Number(product.price).toFixed(2)}</span>
            {product.old_price && (
              <>
                <span className="text-lg text-gray-400 line-through mb-1">TZS {Number(product.old_price).toFixed(2)}</span>
                <span className="text-sm font-bold text-emerald-500 mb-2">
                  Save TZS {(Number(product.old_price) - Number(product.price)).toFixed(2)}
                </span>
              </>
            )}
          </div>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description || "This premium item is designed to offer the best experience. Made with high-quality materials and built to last."}
          </p>
          
          {/* Quantity & Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-full h-12">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-primary transition"
              >-</button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-primary transition"
              >+</button>
            </div>
            
            <button 
              onClick={toggleWishlist}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition shadow-sm hover:shadow-md ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-500 hover:text-primary hover:border-primary'}`}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            
            <button className="w-12 h-12 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:text-primary hover:border-primary transition shadow-sm hover:shadow-md">
              <Share2 size={20} />
            </button>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="w-12 h-12 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-sm hover:shadow-md"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 h-12 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition shadow-sm hover:shadow-md"
            >
              Order Now
            </button>
          </div>
          
        </div>
      </div>



      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
