import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

export default function Categories() {
  const navigate = useNavigate();
  const { categories, products } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate product counts for each category
  const categoriesWithCounts = useMemo(() => {
    return categories.map(category => {
      const count = products.filter(p => p.category === category.name).length;
      return { ...category, count };
    });
  }, [categories, products]);

  // Filter based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categoriesWithCounts;
    return categoriesWithCounts.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoriesWithCounts, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-3xl font-heading font-bold text-gray-900">All Categories</h1>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link 
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center bg-white border border-border p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all group h-full"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-50 mb-4 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-center mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                  {category.count} {category.count === 1 ? 'Item' : 'Items'}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-border">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500">We couldn't find any category matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
