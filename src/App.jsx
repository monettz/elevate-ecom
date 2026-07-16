import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDataStore } from './store/useDataStore';
import MainLayout from './components/layout/MainLayout';

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
  </div>
);

// Storefront Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Shop = lazy(() => import('./pages/Shop'));
const Categories = lazy(() => import('./pages/Categories'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Invoice = lazy(() => import('./pages/Invoice'));

// Admin Pages (Lazy Loaded)
const AdminProtectedRoute = lazy(() => import('./components/admin/AdminProtectedRoute'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminVerify = lazy(() => import('./pages/admin/AdminVerify'));
const Forbidden403 = lazy(() => import('./pages/admin/Forbidden403'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminFlashSales = lazy(() => import('./pages/admin/AdminFlashSales'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));

const StaticPage = ({ title, content }) => (
  <div className="max-w-4xl mx-auto px-4 py-16 min-h-[60vh]">
    <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">{title}</h1>
    <div className="text-gray-600 leading-relaxed text-lg">
      <p>{content || `Welcome to the ${title} page. This is a functional page ready for your actual content.`}</p>
    </div>
  </div>
);

function App() {
  const { fetchAllData, setupRealtime } = useDataStore();

  useEffect(() => {
    // Only fetch public storefront data globally. 
    // Admin data is deferred to AdminLayout to save massive bandwidth.
    fetchAllData();
    setupRealtime();
  }, []);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/verify" element={<AdminVerify />} />
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

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="categories" element={<Categories />} />
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
      </Suspense>
    </Router>
  );
}

export default App;
