import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import { fetchAsianMovies } from "@/services/api";
import { Button } from "@/components/ui/button";

const AsianMoviesPage = () => {
  const [page, setPage] = useState(1);
  
  // الحصول على الأفلام الآسيوية
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["asian", "movies", page],
    queryFn: () => fetchAsianMovies(page),
  });

  // التعامل مع زر التالي
  const handleNextPage = () => {
    if (data?.total_pages && page < data.total_pages) {
      setPage((old) => old + 1);
    }
  };

  // التعامل مع زر السابق
  const handlePrevPage = () => {
    setPage(old => Math.max(old - 1, 1));
  };

  return (
    <Layout>
      <div className="mb-10">
        {/* عنوان الصفحة */}
        <motion.div 
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex items-center justify-center">
            <Globe className="w-12 h-12 text-accent mr-3" />
            <h1 className="text-4xl font-bold text-accent">
              أفلام آسيوية
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            استمتع بمجموعة متنوعة من الأفلام الآسيوية المميزة من كوريا الجنوبية، اليابان، الصين وغيرها. اكتشف قصصًا فريدة وأساليب سينمائية مختلفة.
          </p>
        </motion.div>

        {/* شبكة الأفلام */}
        <MovieGrid 
          movies={data?.results}
          isLoading={isLoading}
          error={error}
          emptyMessage="لا توجد أفلام آسيوية للعرض."
        />

        {/* أزرار الصفحات */}
        {data && data.total_pages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1 || isLoading}
              variant="outline"
              className="px-6 py-2"
            >
              الصفحة السابقة
            </Button>
            
            <span className="text-muted-foreground">
              صفحة {page} من {data.total_pages}
            </span>
            
            <Button
              onClick={handleNextPage}
              disabled={page >= data.total_pages || isLoading}
              variant="outline"
              className="px-6 py-2"
            >
              الصفحة التالية
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AsianMoviesPage; 