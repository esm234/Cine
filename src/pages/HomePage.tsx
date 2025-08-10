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
import { motion } from "framer-motion";

const HomePage = () => {
  // الحصول على الأفلام والمسلسلات الرائجة
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

  // الحصول على الأفلام والمسلسلات الأعلى تقييمًا
  const { data: topRatedMovies, isLoading: isLoadingTopMovies } = useQuery({
    queryKey: ["top-rated", "movies"],
    queryFn: () => fetchTopRatedMovies(),
  });

  const { data: topRatedTvShows, isLoading: isLoadingTopTvShows } = useQuery({
    queryKey: ["top-rated", "tvshows"],
    queryFn: () => fetchTopRatedTvShows(),
  });

  // الحصول على الأفلام والمسلسلات الآسيوية
  const { data: asianMovies, isLoading: isLoadingAsianMovies } = useQuery({
    queryKey: ["asian", "movies"],
    queryFn: () => fetchAsianMovies(),
  });

  const { data: asianTvShows, isLoading: isLoadingAsianTvShows } = useQuery({
    queryKey: ["asian", "tvshows"],
    queryFn: () => fetchAsianTvShows(),
  });
  
  // الحصول على الأفلام الحاصلة على الأوسكار
  const { data: oscarMovies, isLoading: isLoadingOscarMovies } = useQuery({
    queryKey: ["oscar", "movies"],
    queryFn: () => fetchOscarWinningMovies(),
  });

  return (
    <Layout noPadding>
      {/* قسم العرض الرئيسي */}
      {trendingAll?.results && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Hero movies={trendingAll.results} />
        </motion.div>
      )}

      {/* قسم المحتوى الرئيسي */}
      <div className="px-4 py-8 space-y-12 md:space-y-20">
        {/* الأفلام الرائجة */}
        <MovieSlider
          title="أحدث الأفلام"
          movies={trendingMovies?.results}
          isLoading={isLoadingMovies}
          emptyMessage="لا توجد أفلام رائجة لعرضها."
          seeAllLink="/movies"
        />
        
        {/* الأفلام الحاصلة على جوائز الأوسكار */}
        <MovieSlider
          title="أفلام حاصلة على الأوسكار"
          movies={oscarMovies?.results}
          isLoading={isLoadingOscarMovies}
          emptyMessage="لا توجد أفلام للعرض."
          seeAllLink="/movies/oscar"
          variant="oscar"
        />

        {/* المسلسلات الرائجة */}
        <MovieSlider
          title="أحدث المسلسلات"
          movies={trendingTvShows?.results}
          isLoading={isLoadingTvShows}
          emptyMessage="لا توجد مسلسلات رائجة لعرضها."
          seeAllLink="/tvshows"
        />

        {/* الأفلام الأعلى تقييمًا */}
        <MovieSlider
          title="الأفلام الأعلى تقييمًا"
          movies={topRatedMovies?.results}
          isLoading={isLoadingTopMovies}
          emptyMessage="لا توجد أفلام للعرض."
          seeAllLink="/movies/top-rated"
        />

        {/* المسلسلات الأعلى تقييمًا */}
        <MovieSlider
          title="المسلسلات الأعلى تقييمًا"
          movies={topRatedTvShows?.results}
          isLoading={isLoadingTopTvShows}
          emptyMessage="لا توجد مسلسلات للعرض."
          seeAllLink="/tvshows/top-rated"
        />

        {/* أفلام آسيوية قد تعجبك */}
        <MovieSlider
          title="أفلام آسيوية قد تعجبك"
          movies={asianMovies?.results}
          isLoading={isLoadingAsianMovies}
          emptyMessage="لا توجد أفلام آسيوية للعرض."
          seeAllLink="/movies/asian"
          variant="asian"
        />

        {/* مسلسلات آسيوية قد تعجبك */}
        <MovieSlider
          title="مسلسلات آسيوية قد تعجبك"
          movies={asianTvShows?.results}
          isLoading={isLoadingAsianTvShows}
          emptyMessage="لا توجد مسلسلات آسيوية للعرض."
          seeAllLink="/tvshows/asian"
          variant="asian"
        />

        {/* تصنيفات الأفلام */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-4"
        >
          <GenresList genres={COMMON_GENRES} title="تصفح حسب التصنيف" />
        </motion.div>
      </div>
    </Layout>
  );
};

export default HomePage;
