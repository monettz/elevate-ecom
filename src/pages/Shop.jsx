import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import ProductCard from '../components/ui/ProductCard';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const searchQuery = searchParams.get('query');
  const filterParam = searchParams.get('filter');
  
  const { products, categories, brands } = useDataStore();

  const [isGridView, setIsGridView] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  
  // Filtering logic
  const filteredProducts = products.filter(p => {
    let matchesCategory = true;
    let matchesQuery = true;
    let matchesFilter = true;

    if (selectedCategory !== 'All') {
      matchesCategory = p.category.toLowerCase() === selectedCategory.toLowerCase() || p.category === selectedCategory;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      matchesQuery = (p.name && p.name.toLowerCase().includes(q)) || 
                     (p.description && p.description.toLowerCase().includes(q)) || 
                     (p.category && p.category.toLowerCase().includes(q));
    }

    if (filterParam === 'deals') {
      matchesFilter = p.is_best_deal;
    } else if (filterParam === 'trending') {
      matchesFilter = p.is_trending;
    }

    return matchesCategory && matchesQuery && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Shop All Products'}
        </h1>
        <p className="text-gray-500">Showing {filteredProducts.length} results</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden flex items-center justify-center gap-2 bg-gray-100 py-3 rounded-lg font-medium"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <SlidersHorizontal size={20} /> Filters
        </button>

        {/* Sidebar Filters */}
        <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 space-y-8`}>
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`transition ${selectedCategory === 'All' ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
                >
                  All Categories
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`transition ${selectedCategory === cat.name ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>



          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Price Range</h3>
            <input type="range" min="0" max="3000" className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>TZS 0</span>
              <span>TZS 3000+</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="border-gray-300 rounded-md text-sm py-1.5 focus:ring-primary focus:border-primary">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsGridView(true)} 
                className={`p-2 rounded ${isGridView ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <Grid size={20} />
              </button>
              <button 
                onClick={() => setIsGridView(false)} 
                className={`p-2 rounded ${!isGridView ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className={`grid gap-6 ${isGridView ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">
                No products found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
