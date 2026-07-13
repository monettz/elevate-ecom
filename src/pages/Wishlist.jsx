import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore, useCartStore } from '../store/useStore';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore(state => state.addToCart);

  const handleMoveToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <Heart size={40} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8">Save items you like here to review them later.</p>
        <Link to="/shop" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>
      
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="border border-border rounded-xl p-4 flex flex-col relative group">
              <button 
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white shadow rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              
              <Link to={`/product/${product.id}`} className="block relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </Link>
              
              <div className="flex-1 flex flex-col">
                <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                <Link to={`/product/${product.id}`} className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 hover:text-primary">
                  {product.name}
                </Link>
                <div className="font-bold text-gray-900 mt-auto pb-4">TZS {product.price.toFixed(2)}</div>
                
                <button 
                  onClick={() => handleMoveToCart(product)}
                  className="w-full py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
