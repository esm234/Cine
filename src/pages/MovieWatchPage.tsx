import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Star } from "lucide-react";
import Layout from "@/components/Layout";
import VidsrcPlayer from "@/components/VidsrcPlayer";
import { Button } from "@/components/ui/button";
import { fetchMovieDetails, getImageUrl } from "@/services/api";

const MovieWatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "0");

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId
  });

  // تنسيق البيانات
  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const formattedRuntime = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)} ساعة ${movie.runtime % 60} دقيقة`
    : "";

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* زر العودة */}
        <div className="mb-6">
          <Link to={`/movie/${movieId}`}>
            <Button variant="ghost" className="group flex items-center gap-2 text-white/70 hover:text-white">
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              العودة إلى صفحة الفيلم
            </Button>
          </Link>
        </div>

        {/* معلومات الفيلم */}
        {movie && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* صورة الفيلم */}
              <div className="w-32 sm:w-40 h-48 sm:h-60 rounded-lg overflow-hidden shadow-lg flex-shrink-0 mx-auto md:mx-0">
                <img 
                  src={getImageUrl(movie.poster_path)} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* معلومات الفيلم */}
              <div className="w-full md:w-auto text-center md:text-right">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-3 text-white/70 justify-center md:justify-start">
                  {releaseYear && (
                    <div className="flex items-center gap-1">
                      <Calendar size={16} className="text-accent" />
                      <span>{releaseYear}</span>
                    </div>
                  )}
                  
                  {formattedRuntime && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-accent" />
                      <span>{formattedRuntime}</span>
                    </div>
                  )}
                  
                  {movie.vote_average > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-white/80 line-clamp-2 max-w-2xl mx-auto md:mx-0">
                  {movie.overview || "لا يوجد وصف متاح لهذا الفيلم."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* عنوان المشاهدة */}
        <div className="mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent text-center md:text-right">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            مشاهدة {movie?.title || "الفيلم"} مترجم
          </h2>
        </div>

        {/* مشغل الفيديو */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <VidsrcPlayer tmdbId={movieId} type="movie" />
        </motion.div>

        {/* نصائح إضافية */}
        <div className="mt-8 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="font-semibold mb-2 text-white">ملاحظات هامة:</h3>
          <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
            <li>إذا توقف الفيديو أثناء التحميل، قم بتحديث الصفحة أو تغيير مصدر المشاهدة</li>
            <li>بعض المصادر قد تطلب منك الضغط على زر التشغيل أكثر من مرة</li>
            <li>تأكد من تفعيل مانع الإعلانات للحصول على تجربة مشاهدة أفضل</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default MovieWatchPage; 
