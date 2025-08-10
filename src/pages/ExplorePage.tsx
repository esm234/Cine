import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchDiscoverMovies, fetchGenres } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState<"movies" | "tvshows">("movies");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [runtime, setRuntime] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // استعلام لجلب الأفلام المكتشفة
  const { data: movies, isLoading: isLoadingMovies } = useQuery({
    queryKey: ["discover", activeTab, sortBy, year, selectedGenre, runtime],
    queryFn: () => fetchDiscoverMovies({
      mediaType: activeTab,
      sortBy,
      year: year !== "all" && year ? parseInt(year) : undefined,
      withGenres: selectedGenre !== "all" && selectedGenre ? parseInt(selectedGenre) : undefined,
      withRuntime: runtime !== "all" && runtime ? getRuntimeRange(runtime) : undefined,
    }),
  });

  // استعلام لجلب التصنيفات
  const { data: genresData } = useQuery({
    queryKey: ["genres", activeTab],
    queryFn: () => fetchGenres(activeTab === "movies" ? "movie" : "tv"),
  });

  const genres = genresData?.genres || [];

  // قائمة خيارات الترتيب
  const sortOptions = [
    { value: "popularity.desc", label: "الأكثر شهرة" },
    { value: "vote_average.desc", label: "الأعلى تقييماً" },
    { value: "primary_release_date.desc", label: "الأحدث" },
    { value: "revenue.desc", label: "الأعلى إيراداً" },
  ];

  // قائمة خيارات مدة الفيلم
  const runtimeOptions = [
    { value: "all", label: "جميع المدد" },
    { value: "short", label: "قصير (أقل من 90 دقيقة)" },
    { value: "medium", label: "متوسط (90-120 دقيقة)" },
    { value: "long", label: "طويل (120-180 دقيقة)" },
    { value: "very_long", label: "طويل جداً (أكثر من 180 دقيقة)" },
  ];

  // دالة لتحويل خيار المدة إلى نطاق دقائق
  const getRuntimeRange = (runtimeOption: string): { min: number, max: number } => {
    switch (runtimeOption) {
      case "short":
        return { min: 1, max: 90 };
      case "medium":
        return { min: 90, max: 120 };
      case "long":
        return { min: 120, max: 180 };
      case "very_long":
        return { min: 180, max: 500 };
      default:
        return { min: 0, max: 500 };
    }
  };

  // توليد قائمة السنوات
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-8 text-center">تصفح العناوين</h1>

          {/* تبويبات الأفلام والمسلسلات */}
          <Tabs 
            defaultValue="movies" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "movies" | "tvshows")}
            className="w-full mb-8"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="movies" className="text-lg">الأفلام</TabsTrigger>
              <TabsTrigger value="tvshows" className="text-lg">المسلسلات</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* زر الفلاتر */}
          <div className="flex justify-center mb-6">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              الفلاتر
            </Button>
          </div>

          {/* قسم الفلاتر */}
          {showFilters && (
            <div className="glass-card p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* اختيار الترتيب */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">الترتيب حسب</label>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اختيار السنة */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">السنة</label>
                <Select
                  value={year}
                  onValueChange={setYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع السنوات</SelectItem>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اختيار التصنيف */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">التصنيف</label>
                <Select
                  value={selectedGenre}
                  onValueChange={setSelectedGenre}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التصنيفات</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* اختيار مدة الفيلم */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">مدة الفيلم</label>
                <Select
                  value={runtime}
                  onValueChange={setRuntime}
                  disabled={activeTab === "tvshows"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدة" />
                  </SelectTrigger>
                  <SelectContent>
                    {runtimeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* عرض الأفلام/المسلسلات */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "movies" | "tvshows")}>
            <TabsContent value="movies" className="mt-0">
              <MovieGrid 
                movies={movies?.results || []} 
                isLoading={isLoadingMovies}
                emptyMessage="لم يتم العثور على أفلام مطابقة للفلاتر المحددة"
              />
            </TabsContent>

            <TabsContent value="tvshows" className="mt-0">
              <MovieGrid 
                movies={movies?.results || []} 
                isLoading={isLoadingMovies}
                mediaType="tv"
                emptyMessage="لم يتم العثور على مسلسلات مطابقة للفلاتر المحددة"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage; 