import { useState, useEffect, useMemo, useCallback } from "react";
import { useFavorites } from "@/hooks/useFavorites.tsx";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  Calendar, 
  Film, 
  Tv, 
  BarChart3, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Sparkles
} from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Movie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";
import { getRecommendedMovies, COMMON_GENRES, analyzeFavoriteMovies } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const [activeFilter, setActiveFilter] = useState<"all" | "movies" | "tvshows">("all");
  const [activeTab, setActiveTab] = useState<"content" | "analytics">("content");
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [topDirectors, setTopDirectors] = useState<any[]>([]);
  const [topActors, setTopActors] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendationFallbackLevel, setRecommendationFallbackLevel] = useState(0);
  const [finalRecommendedMovies, setFinalRecommendedMovies] = useState<any>(null);
  const [isLoadingFinalRecommendations, setIsLoadingFinalRecommendations] = useState(false);
  const [recommendationPage, setRecommendationPage] = useState(1);
  
  // تصفية المفضلة حسب النوع
  const filteredFavorites = favorites.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "movies") return item.title || item.media_type === "movie";
    if (activeFilter === "tvshows") return item.name || item.media_type === "tv";
    return true;
  });

  // حساب الإحصائيات
  const stats = useMemo(() => {
    // فلترة الأفلام فقط للتحليل
    const movies = favorites.filter(item => item.title || item.media_type === "movie");
    const tvShows = favorites.filter(item => item.name || item.media_type === "tv");
    
    // حساب متوسط التقييم
    const avgRating = movies.length > 0 
      ? movies.reduce((sum, movie) => sum + movie.vote_average, 0) / movies.length
      : 0;
    
    // توزيع التقييمات
    const ratingDistribution = {
      high: movies.filter(m => m.vote_average >= 8).length,
      medium: movies.filter(m => m.vote_average >= 6 && m.vote_average < 8).length,
      low: movies.filter(m => m.vote_average < 6).length
    };
    
    // توزيع سنوات الإصدار
    const currentYear = new Date().getFullYear();
    const yearDistribution = {
      new: movies.filter(m => {
        const year = m.release_date ? new Date(m.release_date).getFullYear() : 0;
        return year >= currentYear - 3;
      }).length,
      recent: movies.filter(m => {
        const year = m.release_date ? new Date(m.release_date).getFullYear() : 0;
        return year >= currentYear - 10 && year < currentYear - 3;
      }).length,
      old: movies.filter(m => {
        const year = m.release_date ? new Date(m.release_date).getFullYear() : 0;
        return year < currentYear - 10;
      }).length
    };
    
    // حساب التصنيفات الأكثر شيوعًا
    const genreCounts: Record<number, number> = {};
    movies.forEach(movie => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach(genreId => {
          genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
        });
      }
    });
    
    // ترتيب التصنيفات حسب الشيوع
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 3)
      .map(([genreId]) => Number(genreId));
    
    // حساب مدة الأفلام
    const runtimeDistribution = {
      short: movies.filter(m => m.runtime && m.runtime < 90).length,
      medium: movies.filter(m => m.runtime && m.runtime >= 90 && m.runtime <= 120).length,
      long: movies.filter(m => m.runtime && m.runtime > 120).length,
      unknown: movies.filter(m => !m.runtime).length
    };
    
    return {
      totalMovies: movies.length,
      totalTvShows: tvShows.length,
      avgRating,
      ratingDistribution,
      yearDistribution,
      genreCounts,
      topGenres,
      runtimeDistribution
    };
  }, [favorites]);
  
  // تحديد نوع المستخدم بناءً على التفضيلات
  const userPreferences = useMemo(() => {
    const preferences = [];
    
    // تفضيل التقييم
    if (stats.avgRating >= 8) {
      preferences.push("تفضل الأفلام عالية التقييم");
    } else if (stats.avgRating >= 6) {
      preferences.push("تفضل الأفلام متوسطة التقييم");
    }
    
    // تفضيل العمر
    const { yearDistribution } = stats;
    const maxYearCategory = Object.entries(yearDistribution)
      .sort((a, b) => b[1] - a[1])[0];
      
    if (maxYearCategory[0] === "new" && maxYearCategory[1] > 0) {
      preferences.push("تفضل الأفلام الحديثة");
    } else if (maxYearCategory[0] === "old" && maxYearCategory[1] > 0) {
      preferences.push("تفضل الأفلام الكلاسيكية");
    }
    
    // تفضيل المدة
    const { runtimeDistribution } = stats;
    const maxRuntimeCategory = Object.entries(runtimeDistribution)
      .filter(([key]) => key !== "unknown")
      .sort((a, b) => b[1] - a[1])[0];
      
    if (maxRuntimeCategory && maxRuntimeCategory[1] > 0) {
      if (maxRuntimeCategory[0] === "short") {
        preferences.push("تفضل الأفلام القصيرة");
      } else if (maxRuntimeCategory[0] === "long") {
        preferences.push("تفضل الأفلام الطويلة");
      }
    }
    
    return preferences;
  }, [stats]);
  
  // تحليل المخرجين والممثلين عند تغيير المفضلة أو فتح تبويب التحليلات
  useEffect(() => {
    if (activeTab === "analytics" && favorites.length > 0) {
      setIsAnalyzing(true);
      analyzeFavoriteMovies(favorites).then(res => {
        setTopDirectors(res.topDirectors);
        setTopActors(res.topActors);
      }).finally(() => setIsAnalyzing(false));
    }
  }, [favorites, activeTab]);
  
  // استخراج معايير الترشيح بناءً على التفضيلات والمخرجين والممثلين
  const recommendationCriteria = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    // الافتراضات
    let voteAverageMin = 6;
    let yearMin: number | undefined = undefined;
    let yearMax: number | undefined = currentYear;
    let runtimeMin: number | undefined = undefined;
    let runtimeMax: number | undefined = undefined;
    
    // تعديل معايير التقييم
    if (stats.avgRating >= 8) {
      voteAverageMin = 7.5;
    } else if (stats.avgRating >= 6) {
      voteAverageMin = 6;
    } else {
      voteAverageMin = 0;
    }
    
    // تعديل معايير السنة
    const { yearDistribution } = stats;
    const maxYearCategory = Object.entries(yearDistribution)
      .sort((a, b) => b[1] - a[1])[0];
      
    if (maxYearCategory[0] === "new" && maxYearCategory[1] > 0) {
      yearMin = currentYear - 3;
    } else if (maxYearCategory[0] === "old" && maxYearCategory[1] > 0) {
      yearMax = currentYear - 10;
      yearMin = undefined;
    } else {
      yearMin = currentYear - 10;
    }
    
    // تعديل معايير المدة
    const { runtimeDistribution } = stats;
    const maxRuntimeCategory = Object.entries(runtimeDistribution)
      .filter(([key]) => key !== "unknown")
      .sort((a, b) => b[1] - a[1])[0];
      
    if (maxRuntimeCategory && maxRuntimeCategory[1] > 0) {
      if (maxRuntimeCategory[0] === "short") {
        runtimeMax = 90;
      } else if (maxRuntimeCategory[0] === "long") {
        runtimeMin = 120;
      } else {
        runtimeMin = 90;
        runtimeMax = 120;
      }
    }
    
    return {
      genres: stats.topGenres,
      voteAverageMin,
      yearMin,
      yearMax,
      runtimeMin,
      runtimeMax,
      withDirectors: topDirectors.length > 0 ? [topDirectors[0].id] : [],
      withCast: topActors.slice(0, 2).map(a => a.id)
    };
  }, [stats, topDirectors, topActors]);
  
  // منطق fallback للترشيحات
  const fetchRecommendationsWithFallback = useCallback(async () => {
    if (!favorites.length) return;
    setIsLoadingFinalRecommendations(true);
    let levels = [
      { ...recommendationCriteria, page: recommendationPage },
      { ...recommendationCriteria, withDirectors: [], page: recommendationPage },
      { ...recommendationCriteria, withDirectors: [], withCast: [], page: recommendationPage },
      { genres: recommendationCriteria.genres, voteAverageMin: recommendationCriteria.voteAverageMin, page: recommendationPage },
      { genres: recommendationCriteria.genres, page: recommendationPage }
    ];
    for (let i = 0; i < levels.length; i++) {
      try {
        const res = await getRecommendedMovies(levels[i]);
        if (res?.results && res.results.length > 0) {
          setFinalRecommendedMovies(res);
          setRecommendationFallbackLevel(i);
          setIsLoadingFinalRecommendations(false);
          return;
        }
      } catch {}
    }
    setFinalRecommendedMovies(null);
    setIsLoadingFinalRecommendations(false);
  }, [favorites, recommendationCriteria, recommendationPage]);

  // استدعاء fallback عند فتح الترشيحات
  useEffect(() => {
    if (showRecommendations && favorites.length > 0) {
      setRecommendationPage(1);
    }
  }, [showRecommendations, favorites]);
  
  // عند تغيير الصفحة أو showRecommendations، جلب الترشيحات
  useEffect(() => {
    if (showRecommendations && favorites.length > 0) {
      fetchRecommendationsWithFallback();
    }
  }, [showRecommendations, favorites, recommendationCriteria, fetchRecommendationsWithFallback, recommendationPage]);
  
  // الحصول على أسماء التصنيفات المفضلة
  const favoriteGenreNames = useMemo(() => {
    return stats.topGenres
      .map(genreId => {
        const genre = COMMON_GENRES.find(g => g.id === genreId);
        return genre ? genre.name : null;
      })
      .filter(Boolean);
  }, [stats.topGenres]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">المفضلة</h1>
        
        {favorites.length > 0 ? (
          <>
            <Tabs 
              defaultValue="content" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "content" | "analytics")}
              className="w-full mb-8"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger value="content" className="text-lg">
                  <Film className="ml-2 h-4 w-4" />
                  المحتوى
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-lg">
                  <BarChart3 className="ml-2 h-4 w-4" />
                  التحليلات
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="mt-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    onClick={() => setActiveFilter("all")}
                    variant={activeFilter === "all" ? "default" : "outline"}
                  >
                    الكل ({favorites.length})
                  </Button>
                  <Button
                    onClick={() => setActiveFilter("movies")}
                    variant={activeFilter === "movies" ? "default" : "outline"}
                  >
                    أفلام ({stats.totalMovies})
                  </Button>
                  <Button
                    onClick={() => setActiveFilter("tvshows")}
                    variant={activeFilter === "tvshows" ? "default" : "outline"}
                  >
                    مسلسلات ({stats.totalTvShows})
                  </Button>
                </div>
                
                <MovieGrid
                  movies={filteredFavorites}
                  emptyMessage="لم تقم بإضافة أي محتوى للمفضلة بعد."
                />
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                {favorites.length > 0 ? (
                  <div className="space-y-8">
                    {/* زر الترشيحات */}
                    <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                          size="lg"
                        >
                          <Sparkles className="ml-2 h-5 w-5" />
                          اقتراح أفلام بناءً على تفضيلاتك
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl mb-2">أفلام مقترحة لك</DialogTitle>
                          <DialogDescription>
                            بناءً على تحليل مفضلاتك، اخترنا لك هذه الأفلام التي قد تعجبك
                          </DialogDescription>
                        </DialogHeader>
                        
                        {isLoadingFinalRecommendations ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-muted-foreground">جارٍ تحليل تفضيلاتك والبحث عن أفلام مناسبة...</p>
                          </div>
                        ) : finalRecommendedMovies?.results && finalRecommendedMovies.results.length > 0 ? (
                          <div className="py-4">
                            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                              <h3 className="font-medium mb-2">معايير الاقتراح (المستوى {recommendationFallbackLevel + 1}):</h3>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {recommendationFallbackLevel === 0 && <li>• تم الترشيح بناءً على كل تفضيلاتك (تصنيفات، مخرج، ممثلين، تقييم...)</li>}
                                {recommendationFallbackLevel === 1 && <li>• تم الترشيح بناءً على التصنيفات والممثلين والتقييم فقط (بدون المخرج)</li>}
                                {recommendationFallbackLevel === 2 && <li>• تم الترشيح بناءً على التصنيفات والتقييم فقط (بدون مخرج أو ممثلين)</li>}
                                {recommendationFallbackLevel === 3 && <li>• تم الترشيح بناءً على التصنيفات والتقييم فقط</li>}
                                {recommendationFallbackLevel === 4 && <li>• تم الترشيح بناءً على التصنيفات فقط (أشهر الأفلام)</li>}
                              </ul>
                            </div>
                            <MovieGrid 
                              movies={finalRecommendedMovies.results.filter(m => !favorites.some(f => f.id === m.id))} 
                              emptyMessage="لم نتمكن من العثور على ترشيحات مناسبة"
                            />
                            <Button 
                              className="mt-4 w-full" 
                              variant="outline" 
                              onClick={() => setRecommendationPage(p => p + 1)}
                            >
                              ترشيحات أخرى
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground">لم نتمكن من العثور على أفلام مناسبة لتفضيلاتك</p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {/* ملخص التفضيلات */}
                    {userPreferences.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Users className="ml-2" />
                            تحليل تفضيلاتك
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg">بناءً على مفضلاتك، يبدو أنك:</p>
                          <ul className="mt-4 space-y-2">
                            {userPreferences.map((pref, idx) => (
                              <li key={idx} className="flex items-center text-lg">
                                <span className="ml-2 text-primary">•</span> {pref}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center py-8">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-muted-foreground">جاري تحليل المخرجين والممثلين المفضلين...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card>
                          <CardHeader>
                            <CardTitle>أكثر المخرجين تكرارًا في مفضلتك</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {topDirectors.length > 0 ? (
                              <ul className="space-y-2">
                                {topDirectors.map(d => (
                                  <li key={d.id} className="flex items-center gap-2">
                                    {d.profile_path && <img src={`https://image.tmdb.org/t/p/w45${d.profile_path}`} alt={d.name} className="w-8 h-8 rounded-full" />}
                                    <span>{d.name}</span>
                                    <span className="text-xs text-muted-foreground">({d.count} أفلام)</span>
                                  </li>
                                ))}
                              </ul>
                            ) : <span className="text-muted-foreground">لا يوجد مخرج مكرر بشكل واضح.</span>}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>أكثر الممثلين تكرارًا في مفضلتك</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {topActors.length > 0 ? (
                              <ul className="space-y-2">
                                {topActors.map(a => (
                                  <li key={a.id} className="flex items-center gap-2">
                                    {a.profile_path && <img src={`https://image.tmdb.org/t/p/w45${a.profile_path}`} alt={a.name} className="w-8 h-8 rounded-full" />}
                                    <span>{a.name}</span>
                                    <span className="text-xs text-muted-foreground">({a.count} أفلام)</span>
                                  </li>
                                ))}
                              </ul>
                            ) : <span className="text-muted-foreground">لا يوجد ممثل مكرر بشكل واضح.</span>}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    
                    {/* إحصائيات المفضلة */}
                    <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                      <CollapsibleTrigger className="w-full">
                        <Card className="hover:bg-muted/50 transition-colors">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center">
                              <BarChart3 className="ml-2" />
                              إحصائيات المفضلة
                            </CardTitle>
                            <div>
                              {isStatsOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>
                          </CardHeader>
                        </Card>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {/* توزيع التقييمات */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Star className="ml-2 text-yellow-500" />
                                توزيع التقييمات
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>ممتاز (8-10)</span>
                                    <span>{stats.ratingDistribution.high}</span>
                                  </div>
                                  <Progress value={(stats.ratingDistribution.high / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>جيد (6-8)</span>
                                    <span>{stats.ratingDistribution.medium}</span>
                                  </div>
                                  <Progress value={(stats.ratingDistribution.medium / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>متوسط أو أقل (&lt;6)</span>
                                    <span>{stats.ratingDistribution.low}</span>
                                  </div>
                                  <Progress value={(stats.ratingDistribution.low / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                                <div className="text-center mt-4">
                                  <p>متوسط التقييم: <span className="font-bold">{stats.avgRating.toFixed(1)}</span></p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* توزيع سنوات الإصدار */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Calendar className="ml-2" />
                                توزيع سنوات الإصدار
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>حديثة (آخر 3 سنوات)</span>
                                    <span>{stats.yearDistribution.new}</span>
                                  </div>
                                  <Progress value={(stats.yearDistribution.new / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>متوسطة (3-10 سنوات)</span>
                                    <span>{stats.yearDistribution.recent}</span>
                                  </div>
                                  <Progress value={(stats.yearDistribution.recent / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>قديمة (أكثر من 10 سنوات)</span>
                                    <span>{stats.yearDistribution.old}</span>
                                  </div>
                                  <Progress value={(stats.yearDistribution.old / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* توزيع مدة الأفلام */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Clock className="ml-2" />
                                توزيع مدة الأفلام
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>قصيرة (&lt;90 دقيقة)</span>
                                    <span>{stats.runtimeDistribution.short}</span>
                                  </div>
                                  <Progress value={(stats.runtimeDistribution.short / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>متوسطة (90-120 دقيقة)</span>
                                    <span>{stats.runtimeDistribution.medium}</span>
                                  </div>
                                  <Progress value={(stats.runtimeDistribution.medium / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span>طويلة (&gt;120 دقيقة)</span>
                                    <span>{stats.runtimeDistribution.long}</span>
                                  </div>
                                  <Progress value={(stats.runtimeDistribution.long / stats.totalMovies) * 100} className="h-2 bg-muted" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground">أضف بعض الأفلام إلى المفضلة لرؤية التحليلات</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">لم تقم بإضافة أي محتوى للمفضلة بعد.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
