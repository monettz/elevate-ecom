import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useDataStore = create((set, get) => ({
  products: [],
  categories: [],
  banners: [],
  brands: [],
  customers: [],
  orders: [],
  coupons: [],
  flashSales: [],
  heroSlides: [],
  loading: true,
  isSubscribed: false,

  fetchProducts: async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (!error && data) set({ products: data });
  },

  fetchCategories: async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error && data) set({ categories: data });
  },

  fetchBanners: async () => {
    const { data, error } = await supabase.from('promotional_banners').select('*');
    if (!error && data) set({ banners: data });
  },

  fetchBrands: async () => {
    const { data, error } = await supabase.from('brands').select('*');
    if (!error && data) set({ brands: data });
  },

  fetchAdminData: async () => {
    set({ loading: true });
    try {
      const [customersRes, ordersRes, couponsRes, flashSalesRes] = await Promise.all([
        supabase.from('customers').select('*'),
        supabase.from('orders').select('*, order_items(*)').order('date', { ascending: false }),
        supabase.from('coupons').select('*'),
        supabase.from('flash_sales').select('*')
      ]);
      
      set({
        customers: customersRes.data || [],
        orders: ordersRes.data || [],
        coupons: couponsRes.data || [],
        flashSales: flashSalesRes.data || [],
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllData: async () => {
    set({ loading: true });
    try {
      await Promise.all([
        get().fetchProducts(),
        get().fetchCategories(),
        get().fetchBanners(),
        get().fetchBrands()
      ]);
    } catch (err) {
      console.error('Error fetching storefront data:', err);
    } finally {
      set({ loading: false });
    }
  },

  setupRealtime: () => {
    if (get().isSubscribed) return;
    set({ isSubscribed: true });
    
    supabase.channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Change received!', payload);
        // Refresh all data dynamically when any public table changes
        get().fetchAllData();
        get().fetchAdminData();
      })
      .subscribe();
  }
}));
