import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, appliedCoupon, setCoupon } = useCartStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'Percentage') {
      discount = subtotal * (appliedCoupon.value / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }
  
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponInput.trim().toUpperCase())
        .single();
        
      if (error || !data) {
        alert('Invalid coupon code.');
        return;
      }
      
      if (data.status !== 'Active') {
        alert('This coupon is no longer active.');
        return;
      }
      
      if (data.expiry && new Date(data.expiry) < new Date()) {
        alert('This coupon has expired.');
        return;
      }
      
      setCoupon(data);
      setCouponInput('');
    } catch (err) {
      console.error(err);
      alert('Error verifying coupon.');
    } finally {
      setIsApplying(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingCart size={40} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
              <span className="font-semibold text-gray-900">Items ({cart.length})</span>
              <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
            </div>
            
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-primary transition line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    <div className="font-bold text-gray-900">TZS {item.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="flex items-center border border-gray-300 rounded-lg h-9">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary transition"
                      >-</button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary transition"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">TZS {subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">- TZS {discount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    <button onClick={() => setCoupon(null)} className="text-red-500 hover:text-red-700 text-xs underline">Remove</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">TZS {total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
            
            {!appliedCoupon && (
              <div className="mb-6">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon Code" 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm uppercase"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={isApplying || !couponInput.trim()}
                    className="px-4 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                  >
                    {isApplying ? '...' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full h-12 bg-primary text-white rounded-full font-bold hover:bg-blue-700 transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
