import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDataStore } from './store/useDataStore';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderTracking from './pages/OrderTracking';
import Invoice from './pages/Invoice';

import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Forbidden403 from './pages/admin/Forbidden403';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminFlashSales from './pages/admin/AdminFlashSales';
import AdminMedia from './pages/admin/AdminMedia';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';
import AdminBlog from './pages/admin/AdminBlog';

const StaticPage = ({ title, content }) => (
  <div className="max-w-4xl mx-auto px-4 py-16 min-h-[60vh]">
    <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">{title}</h1>
    <div className="text-gray-600 leading-relaxed text-lg">
      <p>{content || `Welcome to the ${title} page. This is a functional page ready for your actual content.`}</p>
    </div>
  </div>
);

function App() {
  const { fetchAllData, fetchAdminData, setupRealtime } = useDataStore();

  useEffect(() => {
    fetchAllData();
    fetchAdminData();
    setupRealtime();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login/*" element={<AdminLogin />} />
        <Route path="/admin/forbidden" element={<Forbidden403 />} />
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="flash-sales" element={<AdminFlashSales />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>
        </Route>

        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="categories" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          <Route path="order-tracking/:id" element={<OrderTracking />} />
          <Route path="invoice/:id" element={<Invoice />} />
          
          <Route path="contact" element={<StaticPage title="Contact Us" content="Reach out to our customer support team at support@elevate.com." />} />
          <Route path="privacy" element={<StaticPage title="Privacy Policy" />} />
          <Route path="terms" element={<StaticPage title="Terms of Service" />} />
          <Route path="*" element={<StaticPage title="404 Not Found" content="The page you are looking for does not exist." />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
