import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Star, Calendar, Film, Tv, Play } from 'lucide-react';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/services/api';
import { useFavorites } from '@/hooks/useFavorites.tsx';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  index?: number;
  isHovered?: boolean;
}

const MovieCard = ({ movie, index = 0, isHovered = false }: MovieCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  // استخدام isHovered من الخارج إذا كان متاحًا، وإلا استخدام الحالة الداخلية
  const [internalHovered, setInternalHovered] = useState(false);
  const effectiveHovered = isHovered !== undefined ? isHovered : internalHovered;
  const isFavorited = isFavorite(movie.id);

  // تحديد نوع المحتوى (فيلم أو مسلسل)
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const title = movie.title || movie.name || '';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  // تصنيف التقييم بالألوان
  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      className="movie-card relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      whileHover={{ y: -5 }}
    >
      <Link to={`/${mediaType}/${movie.id}`} className="block relative overflow-hidden" aria-label={title}>
        {/* صورة الفيلم */}
        <div className="overflow-hidden rounded-xl aspect-[2/3] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>
          
          {!movie.poster_path ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface text-muted-foreground p-4">
              {mediaType === 'movie' ? <Film size={48} /> : <Tv size={48} />}
              <span className="mt-2 text-center text-sm">{title}</span>
            </div>
          ) : (
            <img
              src={getImageUrl(movie.poster_path)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          )}

          {/* شارة نوع المحتوى */}
          <div className="absolute top-2 left-2 z-10">
            <div className="py-1 px-2 rounded-md bg-black/60 text-accent text-xs font-medium">
              {mediaType === 'movie' ? 'فيلم' : 'مسلسل'}
            </div>
          </div>
          
          {/* التقييم */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 z-10 py-1 px-2 rounded-md bg-black/60 flex items-center space-x-1 rtl:space-x-reverse">
              <Star size={12} className="text-yellow-400 fill-yellow-400 ml-1" />
              <span className={cn("text-xs font-bold", getRatingColor(movie.vote_average))}>
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}

          {/* اسم الفيلم وسنة الإصدار - في أسفل الصورة */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
            <h3 className="font-bold text-white text-lg line-clamp-1">
              {title}
            </h3>
            {year && (
              <div className="flex items-center text-xs text-gray-300 mt-1">
                <span>{year}</span>
              </div>
            )}
          </div>
          
          {/* طبقة التحويم */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-accent/80 via-primary/50 to-primary/30 transition-opacity duration-300 ${effectiveHovered ? 'opacity-70' : 'opacity-0'} z-10 flex items-center justify-center flex-col`}
          >
            {/* زر التشغيل */}
            <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center transform transition-transform duration-300 ${effectiveHovered ? 'scale-100' : 'scale-0'}`}>
              <Play size={32} className="text-accent ml-1 fill-accent" />
            </div>
            
            {/* الوصف المختصر */}
            {movie.overview && (
              <p className={`text-white text-sm line-clamp-3 px-4 mt-5 text-center transition-opacity duration-300 ${effectiveHovered ? 'opacity-100' : 'opacity-0'}`}>
                {movie.overview}
              </p>
            )}
          </div>
        </div>
        
        {/* زر المفضلة - مظهر جديد */}
        <motion.button
          onClick={handleFavoriteToggle}
          className={cn(
            "absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transform transition-all duration-300 shadow-lg",
            effectiveHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            isFavorited 
              ? "bg-accent text-white" 
              : "bg-white text-accent"
          )}
          aria-label={isFavorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bookmark size={20} fill={isFavorited ? 'currentColor' : 'none'} />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
