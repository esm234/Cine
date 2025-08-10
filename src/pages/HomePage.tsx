import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import MovieGrid from "@/components/MovieGrid";
import MovieSlider from "@/components/MovieSlider";
import GenresList from "@/components/GenresList";
import { 
  fetchTrending, 
  COMMON_GENRES, 
  fetchTopRatedMovies, 
  fetchTopRatedTvShows,
  fetchAsianMovies,
  fetchAsianTvShows,
  fetchOscarWinningMovies
} from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Trophy, 
  Star, 
  TrendingUp, 
  Globe, 
  Film,
  Flame,
  Tv,
  Crown,
  Award
} from "lucide-react";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // جميع الاستعلامات
  const { data: trendingAll, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending", "all", "week"],
    queryFn: () => fetchTrending("all", "week"),
  });

  const { data: trendingMovies, isLoading: isLoadingMovies } = useQuery({
    queryKey: ["trending", "movie", "week"],
    queryFn: () => fetchTrending("movie", "week"),
  });

  const { data: trendingTvShows, isLoading: isLoadingTvShows } = useQuery({
    queryKey: ["trending", "tv", "week"],
    queryFn: () => fetchTrending("tv", "week"),
  });

  const { data: topRatedMovies, isLoading: isLoadingTopMovies } = useQuery({
    queryKey: ["top-rated", "movies"],
    queryFn: () => fetchTopRatedMovies(),
  });

  const { data: topRatedTvShows, isLoading: isLoadingTopTvShows } = useQuery({
    queryKey: ["top-rated", "tvshows"],
    queryFn: () => fetchTopRatedTvShows(),
  });

  const { data: asianMovies, isLoading: isLoadingAsianMovies } = useQuery({
    queryKey: ["asian", "movies"],
    queryFn: () => fetchAsianMovies(),
  });

  const { data: asianTvShows, isLoading: isLoadingAsianTvShows } = useQuery({
    queryKey: ["asian", "tvshows"],
    queryFn: () => fetchAsianTvShows(),
  });
  
  const { data: oscarMovies, isLoading: isLoadingOscarMovies } = useQuery({
    queryKey: ["oscar", "movies"],
    queryFn: () => fetchOscarWinningMovies(),
  });

  // أقسام المحتوى مع أيقونات وألوان مخصصة
  const contentSections = [
    {
      id: "trending-movies",
      title: "🔥 الأكثر رواجاً الآن",
      subtitle: "أفلام تتصدر قوائم المشاهدة",
      movies: trendingMovies?.results,
      isLoading: isLoadingMovies,
      link: "/movies",
      gradient: "from-orange-500 to-red-600",
      icon: <Flame className="w-5 h-5" />,
      badge: "HOT",
      badgeColor: "bg-red-500"
    },
    {
      id: "oscar-movies",
      title: "🏆 تحف سينمائية",
      subtitle: "أفلام حائزة على جوائز الأوسكار",
      movies: oscarMovies?.results,
      isLoading: isLoadingOscarMovies,
      link: "/movies/oscar",
      gradient: "from-yellow-500 to-amber-600",
      icon: <Trophy className="w-5 h-5" />,
      badge: "OSCAR",
      badgeColor: "bg-gradient-to-r from-yellow-400 to-amber-500"
    },
    {
      id: "trending-tv",
      title: "📺 مسلسلات الموسم",
      subtitle: "أحدث المسلسلات التي يتحدث عنها الجميع",
      movies: trendingTvShows?.results,
      isLoading: isLoadingTvShows,
      link: "/tvshows",
      gradient: "from-purple-500 to-pink-600",
      icon: <Tv className="w-5 h-5" />,
      badge: "NEW",
      badgeColor: "bg-purple-500"
    },
    {
      id: "top-movies",
      title: "⭐ الأعلى تقييماً",
      subtitle: "أفلام حازت على إعجاب النقاد والجمهور",
      movies: topRatedMovies?.results,
      isLoading: isLoadingTopMovies,
      link: "/movies/top-rated",
      gradient: "from-blue-500 to-cyan-600",
      icon: <Star className="w-5 h-5" />,
      badge: "TOP RATED",
      badgeColor: "bg-blue-500"
    },
    {
      id: "top-tv",
      title: "💎 مسلسلات استثنائية",
      subtitle: "أفضل المسلسلات على الإطلاق",
      movies: topRatedTvShows?.results,
      isLoading: isLoadingTopTvShows,
      link: "/tvshows/top-rated",
      gradient: "from-indigo-500 to-purple-600",
      icon: <Crown className="w-5 h-5" />,
      badge: "PREMIUM",
      badgeColor: "bg-indigo-500"
    },
    {
      id: "asian-movies",
      title: "🌏 سينما آسيوية",
      subtitle: "روائع من الشرق الأقصى",
      movies: asianMovies?.results,
      isLoading: isLoadingAsianMovies,
      link: "/movies/asian",
      gradient: "from-rose-500 to-pink-600",
      icon: <Globe className="w-5 h-5" />,
      badge: "ASIAN",
      badgeColor: "bg-gradient-to-r from-rose-500 to-pink-500"
    },
    {
      id: "asian-tv",
      title: "🎌 دراما آسيوية",
      subtitle: "مسلسلات كورية ويابانية مميزة",
      movies: asianTvShows?.results,
      isLoading: isLoadingAsianTvShows,
      link: "/tvshows/asian",
      gradient: "from-teal-500 to-green-600",
      icon: <Sparkles className="w-5 h-5" />,
      badge: "K-DRAMA",
      badgeColor: "bg-gradient-to-r from-teal-500 to-green-500"
    }
  ];

  // فئات التصفية السريعة
  const quickFilters = [
    { id: "all", label: "الكل", icon: "🎬" },
    { id: "movies", label: "أفلام", icon: "🎥" },
    { id: "tv", label: "مسلسلات", icon: "📺" },
    { id: "asian", label: "آسيوي", icon: "🌏" },
    { id: "oscar", label: "جوائز", icon: "🏆" }
  ];

  const filteredSections = contentSections.filter(section => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "movies") return section.id.includes("movies") && !section.id.includes("asian");
    if (selectedCategory === "tv") return section.id.includes("tv") && !section.id.includes("asian");
    if (selectedCategory === "asian") return section.id.includes("asian");
    if (selectedCategory === "oscar") return section.id.includes("oscar");
    return true;
  });

  return (
    <Layout noPadding>
      {/* Hero Section مع تأثيرات محسنة */}
      <AnimatePresence mode="wait">
        {trendingAll?.results && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <Hero movies={trendingAll.results} />
            
            {/* Overlay gradient محسن */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            
            {/* نص ترحيبي متحرك */}
            <motion.div 
              className="absolute bottom-20 left-8 right-8 text-center md:text-right"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  اكتشف عالماً من الترفيه
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg">
                أفلام ومسلسلات حصرية بجودة عالية
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* المحتوى الرئيسي */}
      <div className="relative bg-gradient-to-b from-black via-gray-950 to-black min-h-screen">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 px-4 md:px-8 py-12">
          {/* فلاتر سريعة */}
          <motion.div 
            className="mb-12"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {quickFilters.map((filter) => (
                <motion.button
                  key={filter.id}
                  onClick={() => setSelectedCategory(filter.id)}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all duration-300
                    ${selectedCategory === filter.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg mr-2">{filter.icon}</span>
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* أقسام المحتوى */}
          <div className="space-y-16">
            <AnimatePresence mode="wait">
              {filteredSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  className="relative"
                >
                  {/* رأس القسم المحسن */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className={`
                            w-1 h-12 rounded-full bg-gradient-to-b ${section.gradient}
                          `}
                          initial={{ height: 0 }}
                          animate={{ height: 48 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        />
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              {section.title}
                            </h2>
                            <span className={`
                              px-3 py-1 text-xs font-bold rounded-full text-white
                              ${section.badgeColor} animate-pulse
                            `}>
                              {section.badge}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm md:text-base">
                            {section.subtitle}
                          </p>
                        </div>
                      </div>
                      
                      <motion.a
                        href={section.link}
                        className={`
                          px-6 py-2 rounded-full text-white font-medium
                          bg-gradient-to-r ${section.gradient}
                          hover:shadow-lg transition-all duration-300
                          hover:scale-105 active:scale-95
                        `}
                        whileHover={{ x: 5 }}
                      >
                        عرض الكل ←
                      </motion.a>
                    </div>
                  </div>

                  {/* السلايدر مع تأثيرات محسنة */}
                  <div className="relative group">
                    <MovieSlider
                      movies={section.movies}
                                            isLoading={section.isLoading}
                      emptyMessage="جاري التحميل..."
                      showProgress
                      className="overflow-visible"
                    />
                    
                    {/* تأثير التوهج عند التمرير */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-r ${section.gradient} 
                      opacity-0 group-hover:opacity-5 transition-opacity duration-500 
                      pointer-events-none rounded-xl blur-3xl
                    `} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* قسم التصنيفات مع تصميم جديد كلياً */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-24"
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  استكشف حسب التصنيف
                </span>
              </motion.h2>
              <p className="text-gray-400 text-lg">
                اختر من بين مجموعة واسعة من التصنيفات المختلفة
              </p>
            </div>

            {/* شبكة التصنيفات بتصميم بطاقات ثلاثية الأبعاد */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {COMMON_GENRES.map((genre, index) => (
                <motion.a
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  initial={{ opacity: 0, rotateY: -180 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 10,
                    z: 50
                  }}
                  className="group relative"
                  style={{ perspective: "1000px" }}
                >
                  <div className="
                    relative overflow-hidden rounded-2xl
                    bg-gradient-to-br from-gray-800/50 to-gray-900/50
                    backdrop-blur-sm border border-gray-700/50
                    p-6 h-32 flex flex-col justify-center items-center
                    transform transition-all duration-300
                    group-hover:border-purple-500/50
                    group-hover:shadow-2xl group-hover:shadow-purple-500/20
                  ">
                    {/* خلفية متحركة للبطاقة */}
                    <div className="
                      absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    " />
                    
                    {/* أيقونة التصنيف */}
                    <motion.div
                      className="text-3xl mb-2 z-10"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {genre.icon || "🎬"}
                    </motion.div>
                    
                    {/* اسم التصنيف */}
                    <h3 className="
                      text-white font-bold text-center z-10
                      group-hover:text-transparent group-hover:bg-gradient-to-r 
                      group-hover:from-purple-400 group-hover:to-pink-400 
                      group-hover:bg-clip-text transition-all duration-300
                    ">
                      {genre.name}
                    </h3>
                    
                    {/* عدد الأفلام (اختياري) */}
                    <span className="
                      absolute top-2 right-2 text-xs text-gray-500
                      group-hover:text-purple-400 transition-colors
                    ">
                      {Math.floor(Math.random() * 500) + 100}+
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* قسم إحصائيات ممتع */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-24 py-16 relative"
          >
            <div className="
              absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 
              rounded-3xl blur-3xl
            " />
            
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50K+", label: "فيلم ومسلسل", icon: "🎬" },
                { number: "4K", label: "جودة عالية", icon: "📺" },
                { number: "24/7", label: "مشاهدة مستمرة", icon: "⏰" },
                { number: "100+", label: "تصنيف مختلف", icon: "🎭" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 1.2 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className="group cursor-pointer"
                >
                  <div className="text-4xl mb-3 group-hover:animate-bounce">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <span className="
                      bg-gradient-to-r from-yellow-400 to-orange-500 
                      bg-clip-text text-transparent
                    ">
                      {stat.number}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action نهائي */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-24 text-center py-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ابدأ رحلتك السينمائية الآن
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              انضم إلى ملايين المشاهدين واستمتع بأفضل الأفلام والمسلسلات من جميع أنحاء العالم
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-12 py-4 text-lg font-bold rounded-full
                bg-gradient-to-r from-purple-600 to-pink-600
                text-white shadow-2xl shadow-purple-500/30
                hover:shadow-purple-500/50 transition-all duration-300
                relative overflow-hidden group
              "
            >
              <span className="relative z-10">استكشف المزيد</span>
              <div className="
                absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
              " />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* أنماط CSS للأنيميشن */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;
