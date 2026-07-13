import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useDataStore } from '../../store/useDataStore';

export default function Footer() {
  const { categories } = useDataStore();
  return (
    <footer className="bg-black text-white border-t border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <Link to="/" className="text-white hover:opacity-90 transition-opacity mb-6 block w-max">
            <Logo />
          </Link>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Your premium destination for the finest products across electronics, fashion, luxury, and more. Experience shopping like never before.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-white mb-4">Shop Categories</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            {categories?.slice(0, 5).map(cat => (
              <li key={cat.id}>
                <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="hover:text-primary transition">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-white mb-4">Customer Service</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/contact" className="hover:text-primary transition">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-primary transition">FAQs</Link></li>
            <li><Link to="/order-tracking" className="hover:text-primary transition">Track Your Order</Link></li>
            <li><Link to="/returns" className="hover:text-primary transition">Returns & Exchanges</Link></li>
            <li><Link to="/shipping" className="hover:text-primary transition">Shipping Information</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-white mb-4">Stay Connected</h3>
          <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
          <form className="flex mb-6">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-l-md focus:outline-none focus:border-primary placeholder-gray-500"
            />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Elevate eCommerce. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm text-gray-500">
          <Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
