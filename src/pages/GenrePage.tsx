
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchGenres, fetchMoviesByGenre, fetchTvShowsByGenre } from "@/services/api";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";

const GenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as "movie" | "tv" || "movie";
  const genreId = parseInt(id || "0");
  
  // الحصول على قوائم التصنيفات
  const { data: genresData } = useQuery({
    queryKey: ["genres", type],
    queryFn: () => fetchGenres(type),
  });
  
  // الحصول على اسم التصنيف
  const genreName = genresData?.genres?.find(g => g.id === genreId)?.name || `تصنيف #${genreId}`;
  
  // الحصول على قائمة الأفلام أو المسلسلات بالتصنيف المحدد مع دعم الصفحات
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ["genre", type, genreId],
    queryFn: ({ pageParam = 1 }) => 
      type === "tv" 
        ? fetchTvShowsByGenre(genreId, pageParam) 
        : fetchMoviesByGenre(genreId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
  
  // تجميع النتائج من جميع الصفحات
  const allResults = data?.pages.flatMap(page => page.results) || [];
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {type === "tv" ? "مسلسلات" : "أفلام"} {genreName}
        </h1>
        <p className="text-gray-400">
          استكشف {type === "tv" ? "المسلسلات" : "الأفلام"} من فئة {genreName}
        </p>
      </div>
      
      <MovieGrid
        movies={allResults}
        isLoading={isLoading}
        error={error}
        emptyMessage={`لا توجد ${type === "tv" ? "مسلسلات" : "أفلام"} في هذا التصنيف.`}
        showLoadMore={!!hasNextPage}
        onLoadMore={() => fetchNextPage()}
        loadingMore={isFetchingNextPage}
      />
    </Layout>
  );
};

export default GenrePage;
