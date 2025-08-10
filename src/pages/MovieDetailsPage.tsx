import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bookmark, 
  Users, 
  Info, 
  Play, 
  Star, 
  Calendar, 
  Clock, 
  Film,
  Share2,
  Download,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  fetchMovieDetails, 
  getImageUrl, 
  searchYTSMovies,
  createMagnetLink
} from "@/services/api";
import { useFavorites } from "@/hooks/useFavorites.tsx";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { YTSMovie, YTSTorrent } from "@/types/movie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EnhancedVideoPlayer from "@/components/EnhancedVideoPlayer";

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "0");
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  // الحصول على تفاصيل الفيلم
  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId,
  });

  useEffect(() => {
    // تمرير إلى أعلى الصفحة عند تغيير الفيلم
    window.scrollTo(0, 0);
  }, [movieId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[80vh] gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-accent/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-accent/70 border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
          </div>
          <div className="text-xl font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">جارٍ تحميل تفاصيل الفيلم...</div>
        </div>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="glass-card max-w-md mx-auto p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-destructive mb-4">عذراً، لم نتمكن من العثور على الفيلم</h2>
            <p className="text-muted-foreground mb-8">الفيلم المطلوب غير متاح أو تم حذفه.</p>
            <Button asChild className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white shadow-lg">
              <Link to="/">🏠 العودة إلى الرئيسية</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // تنسيق البيانات
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const formattedRuntime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)} ساعة ${movie.runtime % 60} دقيقة`
    : "";
  
  // الحصول على فريق التمثيل
  const cast = movie.credits?.cast || [];
  const directors = movie.credits?.crew?.filter(person => person.job === "Director") || [];

  return (
    <Layout noPadding>
      {/* قسم العرض الرئيسي المحسن */}
      <div className="relative">
        {/* صورة الخلفية الكاملة مع تأثيرات متقدمة */}
        <div className="h-[100vh] w-full absolute top-0 left-0 -z-10 overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
          <img
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title}
              className="w-full h-full object-cover object-top"
          />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/10 to-background/80" />
          </motion.div>
        </div>

        {/* محتوى القسم الرئيسي */}
        <div className="container mx-auto px-4 py-32 md:py-40 relative z-10 min-h-[90vh] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* الملصق المحسن - 4 أعمدة */}
            <motion.div
              className="lg:col-span-4 xl:col-span-3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative mx-auto max-w-[350px]">
                <div className="relative group cursor-pointer" onClick={() => navigate(`/watch/${movie.id}`)}>
                  {/* الملصق الرئيسي */}
                  <div className="relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10 transform transition-transform duration-500 group-hover:scale-[1.02]">
                <img
                      src={getImageUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                      className="w-full h-auto"
                />
                    
                    {/* زر التشغيل */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <Play size={36} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* تأثير الإضاءة */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
                </div>
                
                {/* شارة التقييم */}
                {movie.vote_average > 0 && (
                  <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-black/80 backdrop-blur-md border-4 border-accent flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-bold text-xl text-white">{movie.vote_average.toFixed(1)}</div>
                      <div className="text-[10px] text-accent/80">من 10</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* معلومات الفيلم - 8 أعمدة */}
            <motion.div
              className="lg:col-span-8 xl:col-span-9 space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              {/* التصنيفات */}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <Link 
                    key={genre.id} 
                    to={`/genre/${genre.id}`}
                    className="text-sm py-1.5 px-4 bg-white/5 backdrop-blur-md rounded-full text-white/80 hover:bg-accent/20 hover:text-accent transition-colors border border-white/10"
                  >
                    {genre.name}
                  </Link>
                ))}
                </div>

              {/* العنوان والسنة */}
                <div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 text-white tracking-tight">
                    {movie.title}
                  </h1>
                {movie.original_title && movie.original_title !== movie.title && (
                  <h2 className="text-xl text-white/60 mb-2">{movie.original_title}</h2>
                )}
                  {releaseYear && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="h-5 w-5 text-accent" />
                    <span>{releaseYear}</span>
                </div>
                )}
              </div>

              {/* معلومات إضافية */}
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {formattedRuntime && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="h-5 w-5 text-accent" />
                    <span>{formattedRuntime}</span>
                  </div>
                )}

                {directors.length > 0 && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Film className="h-5 w-5 text-accent" />
                    <span>المخرج: {directors.map(d => d.name).join(', ')}</span>
                  </div>
                )}

                {movie.vote_count > 0 && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="h-5 w-5 text-accent" />
                    <span>{movie.vote_count.toLocaleString('ar-EG')} تقييم</span>
                  </div>
                )}
              </div>

              {/* وصف الفيلم */}
              <div className="max-w-3xl">
                <p className="text-lg text-white/90 leading-relaxed backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10">
                  {movie.overview || "لا يوجد وصف متاح لهذا الفيلم."}
                </p>
              </div>

              {/* أزرار العمل */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  onClick={() => navigate(`/watch/${movie.id}`)}
                  className="bg-gradient-to-r from-accent to-accent/80 hover:opacity-90 text-white py-6 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-accent/20 transition-transform hover:scale-105"
                >
                  <Play size={22} className="ml-1 fill-current" />
                  مشاهدة الفيلم
                </Button>
                
                <Button
                  onClick={() => toggleFavorite(movie)}
                  variant={isFavorite(movie.id) ? "default" : "outline"}
                  className={`py-6 px-8 rounded-xl transition-all duration-300 ${
                    isFavorite(movie.id) 
                      ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" 
                      : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Bookmark
                    size={20}
                    fill={isFavorite(movie.id) ? "currentColor" : "none"}
                    className="ml-2"
                  />
                  {isFavorite(movie.id) ? "في المفضلة" : "إضافة للمفضلة"}
                </Button>
                
                <Button
                  variant="outline"
                  className="py-6 px-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10"
                >
                  <Share2 size={20} className="ml-2" />
                  مشاركة
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* قسم المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-16 space-y-16">
      {/* تبويبات المعلومات المحسنة */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <div className="flex justify-center mb-12">
            <TabsList className="p-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 shadow-lg">
              <TabsTrigger 
                value="overview" 
                className="text-lg px-8 py-3 rounded-full data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Info className="ml-2 h-5 w-5" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger 
                value="cast" 
                className="text-lg px-8 py-3 rounded-full data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Users className="ml-2 h-5 w-5" />
                طاقم العمل
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            {/* محتوى التبويب الأول - النظرة العامة */}
            <TabsContent 
              value="overview" 
              className="space-y-12"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* معلومات إضافية في بطاقات */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* الإيرادات */}
                  {movie.revenue > 0 && (
                    <div className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">الإيرادات</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-500">
                        ${(movie.revenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                  
                  {/* الميزانية */}
                  {movie.budget > 0 && (
                    <div className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Download className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">الميزانية</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-500">
                        ${(movie.budget / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                  
                  {/* الجوائز */}
                  {movie.vote_average >= 8 && (
                    <div className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <Award className="h-5 w-5 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">التقييم</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        <p className="text-2xl font-bold text-yellow-500">
                          {movie.vote_average.toFixed(1)}/10
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* أفلام مشابهة */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent inline-block">أفلام قد تعجبك</h3>
                  <MovieGrid 
                    movies={movie.recommendations?.results || []} 
                    emptyMessage="لا توجد توصيات متاحة" 
                    isLoading={false}
                  />
                </div>
              </motion.div>
            </TabsContent>

            {/* محتوى التبويب الثاني - طاقم التمثيل */}
            <TabsContent 
              value="cast" 
              className="space-y-12"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* المخرجين */}
                {directors.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent inline-block">المخرجون</h3>
                    
                    <div className="flex flex-wrap gap-6">
                      {directors.map((director) => (
                        <Link 
                          key={`director-${director.id}`}
                          to={`/person/${director.id}`}
                          className="block group"
                        >
                          <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent transition-colors duration-300">
                              <Avatar className="w-full h-full">
                                <AvatarImage 
                                  src={getImageUrl(director.profile_path)} 
                                  alt={director.name}
                                  className="object-cover w-full h-full"
                                />
                                <AvatarFallback className="bg-muted text-2xl">
                                  {director.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="mt-3 text-center">
                              <h4 className="font-semibold text-white group-hover:text-accent transition-colors duration-300">{director.name}</h4>
                              <p className="text-xs text-white/60">مخرج</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* الممثلين */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent inline-block">الممثلون</h3>
                
                {cast.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {cast.slice(0, 18).map((actor, index) => (
                      <motion.div
                        key={actor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link 
                          to={`/person/${actor.id}`}
                            className="block group"
                        >
                            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 border border-white/10 bg-black/30 backdrop-blur-sm">
                            <div className="aspect-[3/4] relative">
                              <Avatar className="w-full h-full rounded-none">
                                <AvatarImage 
                                  src={getImageUrl(actor.profile_path)} 
                                  alt={actor.name}
                                  className="object-cover w-full h-full"
                                />
                                <AvatarFallback className="rounded-none bg-muted text-2xl h-full">
                                  {actor.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-accent transition-colors duration-300">{actor.name}</h4>
                                <p className="text-xs text-white/60 line-clamp-1 mt-1">{actor.character}</p>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                    <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl text-center border border-white/10">
                      <p className="text-center text-white/60 py-8">لا توجد بيانات متوفرة عن طاقم التمثيل.</p>
                  </div>
                )}
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
      
      {/* مشغل الفيديو في نافذة منبثقة */}
      <Dialog open={isTrailerPlaying} onOpenChange={setIsTrailerPlaying}>
        <DialogContent className="max-w-5xl w-[90vw] h-[80vh] p-0 bg-black border-white/10">
          <EnhancedVideoPlayer tmdbId={movieId} type="movie" title={movie?.title} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MovieDetailsPage;
