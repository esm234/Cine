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
  Award,
  Heart,
  Eye,
  Globe,
  Sparkles,
  ChevronRight,
  Volume2,
  Zap,
  Trophy,
  Tv,
  MessageCircle
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import EnhancedVideoPlayer from "@/components/EnhancedVideoPlayer";

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "0");
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[80vh] gap-8">
          <motion.div 
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Film className="w-12 h-12 text-purple-600" />
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            جارٍ تحميل الفيلم السينمائي...
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md"
          >
            <div className="mb-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl"
              >
                🎬
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              عذراً! الفيلم غير متاح
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              لم نتمكن من العثور على الفيلم المطلوب
            </p>
            <Button 
              onClick={() => navigate('/')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/25"
            >
              <Sparkles className="ml-2" />
              استكشف أفلام أخرى
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "";
  const formattedRuntime = movie.runtime ? `${Math.floor(movie.runtime / 60)}س ${movie.runtime % 60}د` : "";
  const cast = movie.credits?.cast || [];
  const directors = movie.credits?.crew?.filter(person => person.job === "Director") || [];
  const ratingPercentage = (movie.vote_average / 10) * 100;

  return (
    <Layout noPadding>
      {/* Hero Section - Ultra Modern Design */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={getImageUrl(movie.backdrop_path, "original")}
              alt=""
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight 
                }}
                animate={{ 
                  y: [null, -100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
            
            {/* Poster - Enhanced Design */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="relative max-w-sm mx-auto lg:mx-0">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
                
                {/* Poster Container */}
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={getImageUrl(movie.poster_path, "w500")}
                      alt={movie.title}
                      className="w-full"
                    />
                    
                    {/* Play Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                      onClick={() => navigate(`/watch/${movie.id}`)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl"
                      >
                        <Play size={32} className="text-white ml-1" fill="white" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  
                  {/* Rating Badge */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-6 -right-6 w-20 h-20"
                  >
                    <div className="relative w-full h-full">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white/10"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 36}`}
                          strokeDashoffset={`${2 * Math.PI * 36 * (1 - ratingPercentage / 100)}`}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{movie.vote_average.toFixed(1)}</div>
                          <Star className="w-4 h-4 text-yellow-500 mx-auto" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Movie Info - Modern Layout */}
            <motion.div 
              className="lg:col-span-8 space-y-8"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            >
              {/* Genres as Pills */}
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {movie.genres?.map((genre, index) => (
                  <motion.div
                    key={genre.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                  >
                    <Badge 
                      variant="outline" 
                      className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 ml-1" />
                      {genre.name}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              {/* Title with Animation */}
              <div>
                <motion.h1 
                  className="text-5xl lg:text-7xl font-black mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    {movie.title}
                  </span>
                </motion.h1>
                
                {movie.tagline && (
                  <motion.p 
                    className="text-xl text-purple-300 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    "{movie.tagline}"
                  </motion.p>
                )}
              </div>

              {/* Stats Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {[
                  { icon: Calendar, label: "السنة", value: releaseYear, color: "from-blue-500 to-cyan-500" },
                  { icon: Clock, label: "المدة", value: formattedRuntime, color: "from-green-500 to-emerald-500" },
                  { icon: Users, label: "التقييمات", value: movie.vote_count?.toLocaleString('ar-EG'), color: "from-orange-500 to-red-500" },
                  { icon: Globe, label: "اللغة", value: movie.original_language?.toUpperCase(), color: "from-purple-500 to-pink-500" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  >
                    <Card className="p-4 bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all group">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} p-2 mb-2 group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-full h-full text-white" />
                      </div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Overview */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Info className="w-6 h-6 text-purple-500" />
                  القصة
                </h3>
                <p className="text-lg leading-relaxed text-white/80 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                  {movie.overview || "لا يوجد وصف متاح لهذا الفيلم."}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        onClick={() => navigate(`/watch/${movie.id}`)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/25 group"
                      >
                        <Play className="ml-2 group-hover:scale-110 transition-transform" fill="white" />
                        مشاهدة الآن
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>شاهد الفيلم بجودة عالية</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        variant={isFavorite(movie.id) ? "default" : "outline"}
                        onClick={() => toggleFavorite(movie)}
                        className={`group ${
                          isFavorite(movie.id) 
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white" 
                            : "bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <Heart 
                          className="ml-2 group-hover:scale-110 transition-transform" 
                          fill={isFavorite(movie.id) ? "white" : "none"}
                        />
                        {isFavorite(movie.id) ? "في المفضلة" : "أضف للمفضلة"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFavorite(movie.id) ? "إزالة من المفضلة" : "إضافة إلى قائمة المفضلة"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10 group"
                      >
                        <Share2 className="ml-2 group-hover:scale-110 transition-transform" />
                        مشاركة
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>شارك الفيلم مع أصدقائك</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto px-4 py-20">
        {/* Modern Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all"
            >
              <Sparkles className="ml-2 w-4 h-4" />
              معلومات
            </TabsTrigger>
            <TabsTrigger 
              value="cast" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all"
            >
              <Users className="ml-2 w-4 h-4" />
              الممثلون
            </TabsTrigger>
            <TabsTrigger 
              value="similar" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all"
            >
              <Film className="ml-2 w-4 h-4" />
              مشابه
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            <TabsContent value="overview" asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {movie.revenue > 0 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 border border-green-500/20"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
                      <TrendingUp className="w-8 h-8 text-green-500 mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">الإيرادات</p>
                      <p className="text-3xl font-bold text-green-500">
                        ${(movie.revenue / 1000000).toFixed(1)}M
                      </p>
                    </motion.div>
                  )}

                  {movie.budget > 0 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 border border-blue-500/20"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                      <Zap className="w-8 h-8 text-blue-500 mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">الميزانية</p>
                      <p className="text-3xl font-bold text-blue-500">
                        ${(movie.budget / 1000000).toFixed(1)}M
                      </p>
                    </motion.div>
                  )}

                  {movie.popularity && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 border border-purple-500/20"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                      <Trophy className="w-8 h-8 text-purple-500 mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">الشعبية</p>
                      <p className="text-3xl font-bold text-purple-500">
                        {Math.round(movie.popularity)}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Production Companies */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Tv className="w-6 h-6 text-purple-500" />
                      شركات الإنتاج
                    </h3>
                    <div className="flex flex-wrap gap-6">
                      {movie.production_companies.map((company) => (
                        company.logo_path && (
                          <motion.div
                            key={company.id}
                            whileHover={{ scale: 1.1 }}
                            className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10"
                          >
                            <img
                              src={getImageUrl(company.logo_path, "w200")}
                              alt={company.name}
                              className="h-12 object-contain filter brightness-0 invert opacity-70"
                            />
                          </motion.div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Cast Tab */}
            <TabsContent value="cast" asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Directors */}
                {directors.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Film className="w-6 h-6 text-purple-500" />
                      الإخراج
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {directors.map((director) => (
                        <motion.div
                          key={director.id}
                          whileHover={{ y: -10 }}
                          className="text-center"
                        >
                          <div className="relative mx-auto w-32 h-32 mb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30" />
                            <Avatar className="w-full h-full border-2 border-purple-500/30">
                              <AvatarImage src={getImageUrl(director.profile_path)} />
                              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-600 to-pink-600">
                                {director.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <h4 className="font-semibold">{director.name}</h4>
                          <p className="text-sm text-muted-foreground">مخرج</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cast */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-500" />
                    طاقم التمثيل
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {cast.slice(0, 12).map((actor, index) => (
                      <motion.div
                        key={actor.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -10 }}
                      >
                        <Card className="overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all">
                          <div className="aspect-[3/4] relative">
                            <img
                              src={getImageUrl(actor.profile_path, "w300")}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${actor.name}&background=8b5cf6&color=fff&size=300`;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-sm line-clamp-1">{actor.name}</h4>
                            <p className="text-xs text-purple-400 line-clamp-1 mt-1">{actor.character}</p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
                      </motion.div>
            </TabsContent>

            {/* Similar Movies Tab */}
            <TabsContent value="similar" asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Film className="w-6 h-6 text-purple-500" />
                    أفلام مشابهة
                  </h3>
                  
                  {movie.recommendations?.results && movie.recommendations.results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {movie.recommendations.results.slice(0, 12).map((similarMovie, index) => (
                        <motion.div
                          key={similarMovie.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -10 }}
                          className="group cursor-pointer"
                          onClick={() => navigate(`/movie/${similarMovie.id}`)}
                        >
                          <Card className="overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all">
                            <div className="aspect-[2/3] relative">
                              <img
                                src={getImageUrl(similarMovie.poster_path, "w500")}
                                alt={similarMovie.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-movie.jpg';
                                }}
                              />
                              
                              {/* Overlay with Play Button */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-14 h-14 rounded-full bg-purple-600/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <Play size={24} className="text-white ml-1" fill="white" />
                                  </div>
                                </div>
                              </div>
                              
                              {/* Rating Badge */}
                              {similarMovie.vote_average > 0 && (
                                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                                  <span className="text-xs font-bold">{similarMovie.vote_average.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                                {similarMovie.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {similarMovie.release_date ? new Date(similarMovie.release_date).getFullYear() : 'N/A'}
                              </p>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex flex-col items-center gap-4"
                      >
                        <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Film className="w-12 h-12 text-purple-500" />
                        </div>
                        <p className="text-lg text-muted-foreground">لا توجد أفلام مشابهة متاحة</p>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* You May Also Like Section */}
                {movie.similar?.results && movie.similar.results.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Heart className="w-6 h-6 text-red-500" />
                      قد يعجبك أيضاً
                    </h3>
                    
                    <div className="relative">
                      <motion.div 
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {movie.similar.results.slice(0, 10).map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-shrink-0 w-48"
                          >
                            <Card 
                              className="overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 hover:border-red-500/50 transition-all cursor-pointer group"
                              onClick={() => navigate(`/movie/${item.id}`)}
                            >
                              <div className="aspect-[2/3] relative">
                                <img
                                  src={getImageUrl(item.poster_path, "w300")}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-sm font-semibold line-clamp-2">{item.title}</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Additional Info Section */}
        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Keywords */}
          {movie.keywords?.keywords && movie.keywords.keywords.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                الكلمات المفتاحية
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.keywords.keywords.slice(0, 10).map((keyword) => (
                  <Badge
                    key={keyword.id}
                    variant="secondary"
                    className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 cursor-pointer transition-all"
                  >
                    #{keyword.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              روابط خارجية
            </h3>
            <div className="flex gap-4">
              {movie.homepage && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/5 border-white/20 hover:bg-white/10"
                        onClick={() => window.open(movie.homepage, '_blank')}
                      >
                        <Globe className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>الموقع الرسمي</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {movie.imdb_id && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/5 border-white/20 hover:bg-white/10"
                        onClick={() => window.open(`https://www.imdb.com/title/${movie.imdb_id}`, '_blank')}
                      >
                        <Award className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>صفحة IMDB</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </motion.div>

        {/* Reviews Section (if available) */}
        {movie.reviews?.results && movie.reviews.results.length > 0 && (
          <motion.div
            className="mt-20 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-500" />
              آراء المشاهدين
            </h3>
            
            <div className="grid gap-6">
              {movie.reviews.results.slice(0, 3).map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${review.author}&background=8b5cf6&color=fff`} />
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{review.author}</h4>
                          {review.author_details?.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                              <span className="text-sm">{review.author_details.rating}/10</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {review.content}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Video Player Dialog */}
      <Dialog open={isTrailerPlaying} onOpenChange={setIsTrailerPlaying}>
        <DialogContent className="max-w-5xl w-[90vw] h-[80vh] p-0 bg-black border-white/10">
          <EnhancedVideoPlayer 
            tmdbId={movieId} 
            type="movie" 
            title={movie?.title} 
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MovieDetailsPage;
