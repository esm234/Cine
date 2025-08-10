import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  Star, 
  Calendar, 
  Film, 
  Tv, 
  Play, 
  Heart,
  Clock,
  TrendingUp,
  Eye,
  Plus,
  Info
} from 'lucide-react';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/services/api';
import { useFavorites } from '@/hooks/useFavorites.tsx';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  index?: number;
  isHovered?: boolean;
  variant?: 'default' | 'compact' | 'detailed' | 'premium';
}

const MovieCard = ({ 
  movie, 
  index = 0, 
  isHovered = false,
  variant = 'default' 
}: MovieCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [internalHovered, setInternalHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const effectiveHovered = isHovered !== undefined ? isHovered : internalHovered;
  const isFavorited = isFavorite(movie.id);

  // تحديد نوع المحتوى
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const title = movie.title || movie.name || '';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // تصنيف التقييم بالألوان والأيقونات
  const getRatingStyle = (rating: number) => {
    if (rating >= 8) return { 
      color: 'from-emerald-400 to-green-500', 
      shadow: 'shadow-emerald-500/50',
      text: 'ممتاز',
      emoji: '🔥'
    };
    if (rating >= 7) return { 
      color: 'from-yellow-400 to-amber-500', 
      shadow: 'shadow-yellow-500/50',
      text: 'جيد جداً',
      emoji: '⭐'
    };
    if (rating >= 6) return { 
      color: 'from-orange-400 to-orange-500', 
      shadow: 'shadow-orange-500/50',
      text: 'جيد',
      emoji: '👍'
    };
    return { 
      color: 'from-red-400 to-red-500', 
      shadow: 'shadow-red-500/50',
      text: 'ضعيف',
      emoji: '👎'
    };
  };

  const ratingStyle = getRatingStyle(movie.vote_average);

  // حساب مدة الفيلم (تقديرية)
  const duration = mediaType === 'movie' ? '2h 15m' : `${Math.floor(Math.random() * 8) + 1} مواسم`;

  return (
    <motion.div
      className="movie-card relative group perspective-1000"
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100
      }}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <Link 
        to={`/${mediaType}/${movie.id}`} 
        className="block relative overflow-hidden"
        aria-label={title}
      >
        {/* الحاوية الرئيسية */}
        <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-gradient-to-br from-gray-900 to-black">
          {/* تأثير الخلفية المتحركة */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: effectiveHovered 
                ? 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), transparent)'
                : 'radial-gradient(circle at 50% 50%, transparent, transparent)'
            }}
            transition={{ duration: 0.5 }}
          />

          {/* الصورة الرئيسية */}
          {!movie.poster_path ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 p-4">
              <motion.div
                animate={{ rotate: effectiveHovered ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {mediaType === 'movie' ? <Film size={48} /> : <Tv size={48} />}
              </motion.div>
              <span className="mt-3 text-center text-sm font-medium">{title}</span>
            </div>
          ) : (
            <>
              <motion.img
                src={getImageUrl(movie.poster_path)}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
                animate={{
                  scale: effectiveHovered ? 1.15 : 1,
                  filter: effectiveHovered ? 'brightness(0.7)' : 'brightness(1)'
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              {/* تدرج الظل */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
            </>
          )}

          {/* شريط المعلومات العلوي */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-20">
            {/* نوع المحتوى مع أنيميشن */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="relative"
            >
              <div className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md",
                "bg-gradient-to-r",
                mediaType === 'movie' 
                  ? "from-blue-500/80 to-cyan-500/80 text-white shadow-lg shadow-blue-500/30"
                  : "from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/30"
              )}>
                <span className="flex items-center gap-1">
                  {mediaType === 'movie' ? 
                    <><Film size={12} /> فيلم</> : 
                    <><Tv size={12} /> مسلسل</>
                  }
                </span>
              </div>
              
              {/* شارة NEW للمحتوى الجديد */}
              {movie.release_date && new Date(movie.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  NEW
                </motion.div>
              )}
            </motion.div>

            {/* التقييم المحسن */}
            {movie.vote_average > 0 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="relative"
              >
                <div className={cn(
                  "px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5",
                  "bg-gradient-to-r text-white font-bold text-xs shadow-lg",
                  ratingStyle.color,
                  ratingStyle.shadow
                )}>
                  <span className="text-sm">{ratingStyle.emoji}</span>
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* معلومات الفيلم في الأسفل */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 z-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {/* العنوان */}
            <h3 className="font-bold text-white text-xl mb-2 line-clamp-2 drop-shadow-lg">
              {title}
            </h3>
            
            {/* معلومات إضافية */}
            <div className="flex items-center gap-3 text-xs text-gray-300">
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {year}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {duration}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {Math.floor(Math.random() * 10) + 1}M
              </span>
            </div>

            {/* شريط التقدم (للمسلسلات) */}
            {mediaType === 'tv' && Math.random() > 0.5 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>الحلقة 5</span>
                  <span>40%</span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* طبقة التحويم التفاعلية */}
          <AnimatePresence>
            {effectiveHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/50 to-transparent z-30 flex flex-col items-center justify-center"
              >
                {/* أزرار الإجراءات */}
                <div className="flex gap-3 mb-4">
                  {/* زر التشغيل */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-2xl"
                  >
                    <Play size={24} className="text-black fill-black ml-1" />
                  </motion.div>

                  {/* زر المفضلة */}
                  <motion.button
                    onClick={handleFavoriteToggle}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shadow-xl",
                      isFavorited 
                        ? "bg-yellow-500 text-white" 
                        : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                    )}
                  >
                    <Bookmark size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                  </motion.button>

                  {/* زر الإعجاب */}
                  <motion.button
                    onClick={handleLikeToggle}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shadow-xl",
                      isLiked 
                        ? "bg-red-500 text-white" 
                        : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                    )}
                  >
                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                  </motion.button>

                  {/* زر المعلومات */}
                  <motion.button
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 flex items-center justify-center shadow-xl"
                  >
                    <Info size={18} />
                  </motion.button>
                </div>

                {/* الوصف المختصر */}
                {movie.overview && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-sm line-clamp-3 px-4 text-center max-w-[90%]"
                  >
                    {movie.overview}
                  </motion.p>
                )}

                {/* التصنيفات */}
                {movie.genre_ids && movie.genre_ids.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-2 mt-3 px-4 justify-center"
                  >
                    {movie.genre_ids.slice(0, 3).map((genreId, idx) => (
                      <span
                        key={genreId}
                        className="px-2 py-1 text-[10px] font-medium rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/20"
                      >
                        تصنيف {idx + 1}
                      </span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* مؤشرات الجودة والصوت */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            {/* جودة الفيديو */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white border border-white/20"
            >
              4K
            </motion.div>
            
            {/* نوع الصوت */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white border border-white/20"
            >
              5.1
            </motion.div>
          </div>

          {/* شريط التريند للأفلام الرائجة */}
          {movie.popularity > 100 && (
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ delay: index * 0.1 + 0.7 }}
              className="absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-r-full text-xs font-bold flex items-center gap-1 shadow-lg"
            >
              <TrendingUp size={12} />
              رائج
            </motion.div>
          )}
        </div>

        {/* تأثير الإضاءة الخارجية */}
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: `linear-gradient(45deg, 
              ${movie.vote_average >= 8 ? '#10b981' : 
                movie.vote_average >= 7 ? '#f59e0b' : 
                movie.vote_average >= 6 ? '#ef4444' : '#6b7280'} 0%, 
              transparent 50%, 
              ${movie.vote_average >= 8 ? '#10b981' : 
                movie.vote_average >= 7 ? '#f59e0b' : 
                movie.vote_average >= 6 ? '#ef4444' : '#6b7280'} 100%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* شارة الحصرية */}
        {Math.random() > 0.8 && (
          <motion.div
            initial={{ rotate: -45, scale: 0 }}
            animate={{ rotate: -45, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.8, type: "spring" }}
            className="absolute -top-1 -right-1 w-20 h-20 overflow-hidden"
          >
            <div className="absolute top-5 -right-5 w-24 bg-gradient-to-r from-gold-500 to-yellow-500 text-black text-[8px] font-bold text-center py-1 transform rotate-45 shadow-lg">
              حصري
            </div>
          </motion.div>
        )}
      </Link>

      {/* تأثيرات إضافية للبطاقات المميزة */}
      {variant === 'premium' && (
        <>
          {/* إطار ذهبي متحرك */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* نجوم متحركة */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400"
                style={{
                  top: `${20 + i * 30}%`,
                  left: `${10 + i * 35}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* وضع مضغوط للشبكات الكثيفة */}
      {variant === 'compact' && (
        <style jsx>{`
          .movie-card {
            transform: scale(0.9);
          }
          .movie-card h3 {
            font-size: 0.875rem;
          }
          .movie-card .text-xs {
            font-size: 0.625rem;
          }
        `}</style>
      )}

      {/* وضع تفصيلي مع معلومات إضافية */}
      {variant === 'detailed' && effectiveHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-20 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-4 rounded-b-2xl"
        >
          <div className="text-white text-xs space-y-1">
            <p className="flex items-center gap-2">
              <span className="text-gray-400">المخرج:</span>
              <span>كريستوفر نولان</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gray-400">البطولة:</span>
              <span className="line-clamp-1">ليوناردو دي كابريو، توم هاردي</span>
            </p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px]">
                IMDB 8.8
              </span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px]">
                RT 87%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MovieCard;
