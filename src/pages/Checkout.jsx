import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, appliedCoupon } = useCartStore();
  const [isSuccess, setIsSuccess] = useState(false);
  
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

  const { user, isSignedIn, isLoaded } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          🔒
        </div>
        <h2 className="text-3xl font-heading font-bold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">You must create an account or sign in to place an order and track its status.</p>
        <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
          Sign In / Register
        </button>
      </div>
    );
  }
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Insert Order
      const orderData = {
        id: orderId,
        customer_id: isSignedIn ? user.id : null,
        customer_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        customer_email: isSignedIn ? user.email : 'guest@example.com',
        customer_avatar: isSignedIn ? user.user_metadata?.avatar_url : null,
        total,
        status: 'Processing',
        address: `${formData.get('address')}, ${formData.get('city')}, ${formData.get('postalCode')}`,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        discount_amount: appliedCoupon ? discount : 0
      };
      
      let finalCustomerId = isSignedIn ? user.id : null;
      
      // Ensure customer exists in customers table if signed in
      if (isSignedIn) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (!existingCustomer) {
          // Fallback: check if the email already exists under a different ID
          const { data: customerByEmail } = await supabase
            .from('customers')
            .select('id')
            .eq('email', user.email)
            .single();
            
          if (customerByEmail) {
            finalCustomerId = customerByEmail.id;
          } else {
            const { error: insertError } = await supabase.from('customers').insert({
              id: user.id,
              email: user.email,
              name: orderData.customer_name.trim(),
              role: 'user'
            });
            if (insertError) {
              console.error("Failed to sync customer profile:", insertError);
              throw new Error("Could not sync customer profile.");
            }
          }
        }
      }

      orderData.customer_id = finalCustomerId;

      
      const { error: orderError } = await supabase.from('orders').insert(orderData);
      if (orderError) throw orderError;

      // Insert Order Items
      const items = cart.map(item => ({
        order_id: orderId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }));
      
      const { error: itemsError } = await supabase.from('order_items').insert(items);
      if (itemsError) throw itemsError;

      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
      }, 500);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('We could not place your order due to an unexpected error. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">Thank you for shopping with us. Your order confirmation has been sent to your email.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="text-primary hover:underline">Go to Shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Shipping Info */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-4">1. Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input name="firstName" required type="text" defaultValue={user?.firstName || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input name="lastName" required type="text" defaultValue={user?.lastName || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input name="address" required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input name="city" required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input name="postalCode" required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input name="phone" required type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 text-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold">TZS {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">TZS {subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-medium">- TZS {discount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl">TZS {total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full h-12 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
