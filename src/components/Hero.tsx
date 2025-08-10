import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroProps {
  movies: Movie[];
}

const Hero = ({ movies }: HeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const featuredMovies = movies.slice(0, 5).filter(movie => movie.backdrop_path);

  // تغيير الفيلم المعروض كل 8 ثوانٍ
  useEffect(() => {
    if (!featuredMovies.length || isAutoplayPaused) return;

    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [featuredMovies, isAutoplayPaused]);

  const handleIndicatorHover = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    setIsAutoplayPaused(true);
  };

  const handleIndicatorLeave = () => {
    setIsAutoplayPaused(false);
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
    );
    handleIndicatorHover();
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
    );
    handleIndicatorHover();
  };

  if (!featuredMovies.length) return null;

  const currentMovie = featuredMovies[currentIndex];
  const mediaType = currentMovie.media_type || (currentMovie.title ? "movie" : "tv");
  const title = currentMovie.title || currentMovie.name || "";
  
  // تنسيق البيانات
  const releaseYear = currentMovie.release_date || currentMovie.first_air_date
    ? new Date(currentMovie.release_date || currentMovie.first_air_date || "").getFullYear()
    : "";

  return (
    <div className="relative h-[80vh] lg:min-h-[700px] max-h-[900px] overflow-hidden mb-12 group">
      {/* أزرار التنقل */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 opacity-0 group-hover:opacity-100 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-opacity duration-300 hover:bg-accent/50"
        aria-label="العرض السابق"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={handleNextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 opacity-0 group-hover:opacity-100 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-opacity duration-300 hover:bg-accent/50"
        aria-label="العرض التالي"
      >
        <ChevronRight size={24} />
      </button>

      {/* صورة الخلفية */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0">
            <img
              src={getImageUrl(currentMovie.backdrop_path, "original")}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* معلومات الفيلم */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            {/* صنف المحتوى */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`type-${currentMovie.id}`}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent/90">
                  {mediaType === "movie" ? "فيلم" : "مسلسل"}
                  {releaseYear && <span className="mr-1.5 opacity-75">• {releaseYear}</span>}
                  {currentMovie.vote_average > 0 && (
                    <span className="mr-1.5 opacity-75">• ⭐ {currentMovie.vote_average.toFixed(1)}</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* العنوان */}
            <AnimatePresence mode="wait">
              <motion.h1 
                key={`title-${currentMovie.id}`}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {title}
              </motion.h1>
            </AnimatePresence>

            {/* الوصف */}
            <AnimatePresence mode="wait">
              <motion.p 
                key={`overview-${currentMovie.id}`}
                className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl line-clamp-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {currentMovie.overview || "لا يوجد وصف متاح لهذا المحتوى."}
              </motion.p>
            </AnimatePresence>

            {/* أزرار العمل */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`actions-${currentMovie.id}`}
                className="flex flex-wrap gap-4 md:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link 
                  to={`/${mediaType}/${currentMovie.id}`}
                  className="bg-accent hover:bg-accent/90 text-white py-4 px-8 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                  <Play className="w-5 h-5 mr-1 fill-current" />
                  ابدأ المشاهدة
                </Link>
                <Link
                  to={`/${mediaType}/${currentMovie.id}`}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-4 px-8 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                  <Info className="w-5 h-5 mr-1" />
                  التفاصيل
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* مؤشرات التنقل */}
      <div 
        className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2"
        onMouseEnter={handleIndicatorHover}
        onMouseLeave={handleIndicatorLeave}
      >
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => {
              setCurrentIndex(index);
              handleIndicatorHover();
            }}
            className="relative h-1 rounded-full transition-all duration-300 overflow-hidden"
            style={{ width: index === currentIndex ? '3rem' : '1rem' }}
            aria-label={`انتقل إلى العرض ${index + 1}`}
          >
            {/* الخلفية الرمادية */}
            <span className="absolute inset-0 bg-white/30" />
            
            {/* المؤشر النشط */}
            {index === currentIndex && (
              <span 
                className="absolute inset-0 bg-accent"
                style={{
                  animation: isAutoplayPaused ? 'none' : 'progressBar 10s linear forwards'
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* شريط التظليل السفلي */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      
      {/* أنيميشن لشريط التقدم */}
      <style>{`
        @keyframes progressBar {
          0% { transform: scaleX(0); transform-origin: right; }
          100% { transform: scaleX(1); transform-origin: right; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
