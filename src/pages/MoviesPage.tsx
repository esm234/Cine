
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrending, fetchGenres } from "@/services/api";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import GenresList from "@/components/GenresList";

const MoviesPage = () => {
  // الحصول على الأفلام الرائجة
  const { data: trendingMovies, isLoading } = useQuery({
    queryKey: ["trending", "movie", "week"],
    queryFn: () => fetchTrending("movie", "week"),
  });
  
  // الحصول على تصنيفات الأفلام
  const { data: genresData } = useQuery({
    queryKey: ["genres", "movie"],
    queryFn: () => fetchGenres("movie"),
  });
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">أفلام</h1>
        <p className="text-gray-400">
          اكتشف أحدث وأفضل الأفلام من مختلف التصنيفات
        </p>
      </div>
      
      {/* قائمة التصنيفات */}
      {genresData?.genres && (
        <GenresList 
          genres={genresData.genres} 
          title="تصفح حسب التصنيف" 
          type="movie"
        />
      )}
      
      {/* قائمة الأفلام الرائجة */}
      <MovieGrid
        title="الأفلام الرائجة"
        movies={trendingMovies?.results}
        isLoading={isLoading}
        emptyMessage="لا توجد أفلام لعرضها."
      />
    </Layout>
  );
};

export default MoviesPage;
