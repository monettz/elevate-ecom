import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) => set((state) => {
    const qtyToAdd = product.quantity || 1;
    const existing = state.cart.find(p => p.id === product.id);
    if (existing) {
      return { cart: state.cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + qtyToAdd } : p) };
    }
    return { cart: [...state.cart, { ...product, quantity: qtyToAdd }] };
  }),
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter(p => p.id !== productId) })),
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map(p => p.id === productId ? { ...p, quantity } : p)
  })),
  appliedCoupon: null,
  setCoupon: (coupon) => set({ appliedCoupon: coupon }),
  clearCart: () => set({ cart: [], appliedCoupon: null }),
}));

export const useWishlistStore = create((set) => ({
  wishlist: [],
  addToWishlist: (product) => set((state) => {
    if (state.wishlist.find(p => p.id === product.id)) return state;
    return { wishlist: [...state.wishlist, product] };
  }),
  removeFromWishlist: (productId) => set((state) => ({ wishlist: state.wishlist.filter(p => p.id !== productId) })),
}));


