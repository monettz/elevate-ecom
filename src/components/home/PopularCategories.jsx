import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';

export default function PopularCategories() {
  const { categories } = useDataStore();
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Explore Popular Categories</h2>
        <Link to="/categories" className="text-sm font-medium text-primary hover:underline">
          View All &gt;
        </Link>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 pb-4 hide-scrollbar">
        {categories.map((category, index) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-none snap-start w-[80px] sm:w-[100px] md:w-[120px]"
          >
            <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="flex flex-col items-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gray-100 p-1 mb-2 md:mb-3 overflow-hidden border border-transparent group-hover:border-primary transition-colors shadow-sm group-hover:shadow-md">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 text-center group-hover:text-primary transition-colors leading-tight">
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
