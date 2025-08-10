
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending, fetchGenres } from "@/services/api";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import GenresList from "@/components/GenresList";

const TvShowsPage = () => {
  // الحصول على المسلسلات الرائجة
  const { data: trendingTvShows, isLoading } = useQuery({
    queryKey: ["trending", "tv", "week"],
    queryFn: () => fetchTrending("tv", "week"),
  });
  
  // الحصول على تصنيفات المسلسلات
  const { data: genresData } = useQuery({
    queryKey: ["genres", "tv"],
    queryFn: () => fetchGenres("tv"),
  });
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">مسلسلات</h1>
        <p className="text-gray-400">
          اكتشف أحدث وأفضل المسلسلات من مختلف التصنيفات
        </p>
      </div>
      
      {/* قائمة التصنيفات */}
      {genresData?.genres && (
        <GenresList 
          genres={genresData.genres} 
          title="تصفح حسب التصنيف" 
          type="tv"
        />
      )}
      
      {/* قائمة المسلسلات الرائجة */}
      <MovieGrid
        title="المسلسلات الرائجة"
        movies={trendingTvShows?.results}
        isLoading={isLoading}
        emptyMessage="لا توجد مسلسلات لعرضها."
      />
    </Layout>
  );
};

export default TvShowsPage;
