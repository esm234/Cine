
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { searchMoviesAndTvShows } from "@/services/api";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  
  // البحث في الأفلام والمسلسلات
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMoviesAndTvShows(query),
    enabled: !!query,
  });
  
  // تحديث استعلام البحث عند تقديم النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };
  
  // عدد النتائج المعروضة
  const resultCount = data?.results?.length || 0;
  const totalResults = data?.total_results || 0;
  
  return (
    <Layout>
      <div className="mb-8">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          نتائج البحث
        </motion.h1>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن فيلم أو مسلسل..."
              className="w-full py-3 px-5 pl-12 rounded-full border border-gray-700 bg-gray-800/50 focus:outline-none focus:border-movie-primary transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-movie-primary"
              disabled={!searchQuery.trim()}
            >
              <Search size={20} />
            </button>
          </div>
        </motion.form>
        
        {query && (
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {isLoading ? (
              <p className="text-gray-400">جارٍ البحث...</p>
            ) : error ? (
              <p className="text-red-500">حدث خطأ أثناء البحث. حاول مرة أخرى لاحقًا.</p>
            ) : (
              <p className="text-gray-400">
                {resultCount > 0 
                  ? `تم العثور على ${resultCount} نتيجة من أصل ${totalResults} لـ "${query}"`
                  : `لم يتم العثور على نتائج لـ "${query}"`
                }
              </p>
            )}
          </motion.div>
        )}
      </div>
      
      <MovieGrid
        movies={data?.results}
        isLoading={isLoading}
        error={error}
        emptyMessage={query ? `لم يتم العثور على نتائج لـ "${query}"` : "ابحث عن فيلم أو مسلسل للبدء."}
      />
    </Layout>
  );
};

export default SearchPage;
