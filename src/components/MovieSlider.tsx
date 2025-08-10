import { useState, useRef } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieSliderProps {
  title?: string;
  movies: Movie[] | undefined;
  isLoading?: boolean;
  error?: unknown;
  emptyMessage?: string;
  showSeeAll?: boolean;
  seeAllLink?: string;
  className?: string;
  variant?: 'asian' | 'default' | 'oscar'; // إضافة دعم للأفلام الأوسكار
}

const MovieSlider = ({ 
  title, 
  movies, 
  isLoading = false, 
  error, 
  emptyMessage = "لا توجد أفلام لعرضها",
  showSeeAll = true,
  seeAllLink,
  className = '',
  variant = 'default'
}: MovieSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // التنقل بين الأفلام
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - (clientWidth * 0.75)
        : scrollLeft + (clientWidth * 0.75);
      
      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };
  
  // سكيلتون للتحميل
  const renderSkeletons = () => {
    return Array(10).fill(0).map((_, i) => (
      <div 
        key={`skeleton-${i}`} 
        className="min-w-[180px] max-w-[220px] aspect-[2/3] flex-shrink-0"
      >
        <Skeleton className="w-full h-full rounded-xl shimmer" />
      </div>
    ));
  };
  
  // رسالة في حالة الخطأ
  if (error) {
    return (
      <motion.div 
        className="text-center py-8 glass-card mx-auto max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-red-400 font-medium">حدث خطأ أثناء تحميل البيانات</p>
      </motion.div>
    );
  }
  
  // رسالة في حالة عدم وجود أفلام
  const isEmpty = !isLoading && (!movies || movies.length === 0);
  if (isEmpty) {
    return (
      <motion.div 
        className="text-center py-8 glass-card mx-auto max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-4xl mb-3">🎬</div>
        <p className="text-gray-300">{emptyMessage}</p>
      </motion.div>
    );
  }
  
  // تحديد لون وأسلوب العنوان بناءً على نوع السلايدر
  const getTitleStyle = () => {
    switch(variant) {
      case 'asian':
        return 'text-accent';
      case 'oscar':
        return 'bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent';
      default:
        return 'bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent';
    }
  };
  
  return (
    <section className={`mb-16 ${className} relative group`}>
      {/* عنوان القسم مع زر مشاهدة الكل */}
      {title && (
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            className={`text-2xl font-bold ${getTitleStyle()}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
          
          {showSeeAll && seeAllLink && (
            <Link 
              to={seeAllLink}
              className="flex items-center gap-2 text-sm font-medium text-accent hover:text-primary transition-colors"
            >
              <span>مشاهدة الكل</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
      
      {/* أزرار التنقل للإمام والخلف */}
      <button 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-md hover:bg-accent/20 p-2 rounded-full shadow-lg transform -translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
        onClick={() => scroll('right')}
        aria-label="التالي"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
      
      <button 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-md hover:bg-accent/20 p-2 rounded-full shadow-lg transform translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
        onClick={() => scroll('left')}
        aria-label="السابق"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      {/* السلايدر الأفقي */}
      <div 
        ref={sliderRef}
        className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-5 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading 
          ? renderSkeletons()
          : movies?.map((movie, index) => (
              <motion.div
                key={movie.id}
                className="min-w-[180px] max-w-[220px] flex-shrink-0 snap-start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05 > 0.5 ? 0.5 : index * 0.05,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <MovieCard 
                  movie={movie} 
                  index={index} 
                  isHovered={hoveredIndex === index} 
                />
              </motion.div>
            ))
        }
      </div>
    </section>
  );
};

export default MovieSlider;

// منع عرض scrollbar
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// إضافة الأنماط إلى الصفحة
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 