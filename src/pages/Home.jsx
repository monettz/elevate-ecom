import Hero from '../components/home/Hero';
import PopularCategories from '../components/home/PopularCategories';
import ProductCard from '../components/ui/ProductCard';
import { Link } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';

export default function Home() {
  const { products, banners: promotionalBanners, brands } = useDataStore();

  const deals = products.filter(p => p.is_best_deal).slice(0, 8);
  const featured = products.filter(p => p.is_trending).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      <div className="w-full">
        <Hero />
      </div>

      <div className="space-y-6">
        <PopularCategories />

        {/* Today's Best Deals */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900">Today's Best Deals For You!</h2>
            <Link to="/shop?filter=deals" className="text-sm font-medium text-primary hover:underline">
              View All &gt;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {deals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      {/* Promotional Banners */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotionalBanners.map(banner => (
          <div key={banner.id} className={`${banner.bg_color || 'bg-blue-500'} rounded-2xl p-8 relative overflow-hidden group h-48 flex items-center`}>
            {(banner.title || banner.discount) && (
              <div className={`relative z-10 ${banner.text_color || 'text-white'}`}>
                {banner.discount && <p className="text-sm font-bold uppercase tracking-wider mb-2">{banner.discount}</p>}
                {banner.title && <h3 className="font-heading font-bold text-2xl mb-4 max-w-[200px]">{banner.title}</h3>}
                <Link to="/shop" className="text-sm font-bold underline hover:no-underline">Shop now</Link>
              </div>
            )}
            {banner.image && (
              <img 
                src={banner.image} 
                alt={banner.title || 'Promotional Banner'} 
                className={`absolute right-0 top-0 h-full ${(banner.title || banner.discount) ? 'w-1/2 mix-blend-overlay opacity-80' : 'w-full opacity-100'} object-cover group-hover:scale-110 transition-transform duration-700`} 
              />
            )}
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-heading font-bold text-gray-900">Trending Products</h2>
          <Link to="/shop?filter=trending" className="text-sm font-medium text-primary hover:underline">
            View All &gt;
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="py-8 border-t border-b border-border">
        <h2 className="text-xl font-heading font-bold text-gray-900 mb-6 text-center">Explore Official Brand Stores</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {brands.map(brand => (
            <div key={brand.id} className="flex flex-col items-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3 shadow-sm border border-gray-100 group-hover:border-primary group-hover:shadow-md transition-all">
                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-xs mt-2 font-medium">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
