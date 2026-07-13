import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';

export default function Hero() {
  const { banners } = useDataStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl bg-gray-100 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-gray-400 mb-2">Welcome to Elevate</h2>
        <p className="text-gray-500">Configure your banners in the Admin Panel.</p>
      </div>
    );
  }

  const slide = banners[currentSlide] || banners[0];

  return (
    <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl bg-gray-100 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 ${slide.bg_color || 'bg-gray-900'}`}
        >
          <div className={`absolute inset-0 ${(slide.title || slide.discount) ? 'grid md:grid-cols-2' : ''}`}>
            {(slide.title || slide.discount) && (
              <div className={`p-10 md:p-16 flex flex-col justify-center ${slide.text_color || 'text-white'} z-10`}>
                {slide.title && (
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-heading font-bold mb-4"
                  >
                    {slide.title}
                  </motion.h2>
                )}
                {slide.discount && (
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl font-light mb-2 uppercase tracking-widest"
                  >
                    {slide.discount}
                  </motion.p>
                )}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <Link 
                    to="/shop"
                    className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              </div>
            )}
            
            {slide.image && (
              <div className={`relative h-full ${(slide.title || slide.discount) ? 'hidden md:block' : 'w-full block'}`}>
                <img 
                  src={slide.image} 
                  alt={slide.title || 'Banner'}
                  className={`absolute inset-0 w-full h-full object-cover ${(slide.title || slide.discount) ? 'mix-blend-overlay opacity-80' : 'opacity-100'}`}
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50 z-20"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50 z-20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
