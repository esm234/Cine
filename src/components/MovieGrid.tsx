import { useState } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

interface MovieGridProps {
  title?: string;
  movies: Movie[] | undefined;
  isLoading?: boolean;
  error?: unknown;
  emptyMessage?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  showSeeAll?: boolean;
  seeAllLink?: string;
  mediaType?: string;
}

const MovieGrid = ({ 
  title, 
  movies, 
  isLoading = false, 
  error, 
  emptyMessage = "لا توجد أفلام لعرضها",
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
  showSeeAll = false,
  seeAllLink
}: MovieGridProps) => {
  
  // سكيلتون للتحميل
  const renderSkeletons = () => {
    return Array(10).fill(0).map((_, i) => (
      <motion.div 
        key={`skeleton-${i}`} 
        className="flex flex-col space-y-3 aspect-[2/3]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        <Skeleton className="w-full h-full rounded-xl shimmer" />
      </motion.div>
    ));
  };
  
  // رسالة في حالة الخطأ
  if (error) {
    return (
      <motion.div 
        className="text-center py-16 glass-card mx-auto max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-400 text-lg font-medium">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-gray-400 mt-2">يرجى المحاولة مرة أخرى لاحقاً</p>
      </motion.div>
    );
  }
  
  // رسالة في حالة عدم وجود أفلام
  const isEmpty = !isLoading && (!movies || movies.length === 0);
  if (isEmpty) {
    return (
      <motion.div 
        className="text-center py-16 glass-card mx-auto max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-gray-300 text-lg">{emptyMessage}</p>
      </motion.div>
    );
  }
  
  return (
    <section className="mb-16">
      {/* عنوان القسم مع زر مشاهدة الكل */}
      {title && (
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
          
          {showSeeAll && seeAllLink && (
            <motion.a 
              href={seeAllLink}
              className="flex items-center gap-2 text-sm font-medium text-accent hover:text-primary transition-colors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ x: 5 }}
            >
              <span>مشاهدة الكل</span>
              <ArrowRight size={16} />
            </motion.a>
          )}
        </div>
      )}
      
      {/* شبكة الأفلام بتصميم جديد */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
      >
        {isLoading 
          ? renderSkeletons()
          : movies?.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <MovieCard movie={movie} index={index} />
              </motion.div>
            ))
        }
      </motion.div>
      
      {/* زر تحميل المزيد */}
      {showLoadMore && (
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={onLoadMore} 
            disabled={isLoading || loadingMore}
            variant="outline"
            className="px-8 py-6 bg-surface/30 backdrop-blur-md border-accent/20 rounded-full hover:bg-surface/50 hover:border-accent/40 transition-all duration-300"
          >
            {loadingMore 
              ? <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
                  <span>جارِ التحميل...</span>
                </span>
              : "عرض المزيد"
            }
          </Button>
        </motion.div>
      )}
    </section>
  );
};

export default MovieGrid;
