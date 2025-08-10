import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Bookmark, 
  PlayCircle, 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp,
  Info, 
  ListOrdered,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTvShowDetails, fetchTrending, getImageUrl } from "@/services/api";
import { useFavorites } from "@/hooks/useFavorites.tsx";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TvShowDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const tvShowId = parseInt(id || "0");
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'similar' | 'cast'>('overview');

  // الحصول على تفاصيل المسلسل
  const { data: tvShow, isLoading, error } = useQuery({
    queryKey: ["tvshow", tvShowId],
    queryFn: () => fetchTvShowDetails(tvShowId),
    enabled: !!tvShowId,
  });

  // الحصول على مسلسلات مشابهة
  const { data: similarShows } = useQuery({
    queryKey: ["similar", "tv"],
    queryFn: () => fetchTrending("tv", "week"),
    enabled: activeTab === 'similar',
  });

  useEffect(() => {
    // تمرير إلى أعلى الصفحة عند تغيير المسلسل
    window.scrollTo(0, 0);
  }, [tvShowId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl font-semibold text-muted-foreground">جارٍ تحميل تفاصيل المسلسل...</div>
        </div>
      </Layout>
    );
  }

  if (error || !tvShow) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="glass-card max-w-md mx-auto p-8">
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-bold text-destructive mb-4">عذراً، لم نتمكن من العثور على المسلسل</h2>
            <p className="text-muted-foreground mb-8">المسلسل المطلوب غير متاح أو تم حذفه.</p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-white">
              <Link to="/">🏠 العودة إلى الرئيسية</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // تنسيق البيانات
  const firstAirYear = tvShow.first_air_date 
    ? new Date(tvShow.first_air_date).getFullYear() 
    : "";
  const seasons = tvShow.number_of_seasons || 0;
  const episodes = tvShow.number_of_episodes || 0;
  const isFavorited = isFavorite(tvShow.id);
  
  // الحصول على طاقم التمثيل
  const cast = tvShow.credits?.cast || [];

  return (
    <Layout noPadding>
      {/* قسم الخلفية والبيانات الرئيسية */}
      <div className="relative">
        {/* صورة الخلفية مع التدرجات */}
        <div className="h-[85vh] max-h-[800px] min-h-[550px] w-full absolute top-0 left-0 -z-10 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(tvShow.backdrop_path, "original")}
              alt={tvShow.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* محتوى القسم الرئيسي */}
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 min-h-[70vh] flex flex-col justify-center">
          <div className="max-w-3xl">
            {/* شارة التصنيف والمواسم */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="backdrop-blur-card px-3 py-1.5 rounded-lg text-sm flex items-center border border-primary/20 text-primary">
                <TrendingUp size={16} className="mr-1.5" />
                {tvShow.status}
              </div>
              {seasons > 0 && (
                <div className="backdrop-blur-card px-3 py-1.5 rounded-lg text-sm flex items-center border border-accent/20 text-accent">
                  <ListOrdered size={16} className="mr-1.5" />
                  {seasons} {seasons === 1 ? 'موسم' : 'مواسم'}
                </div>
              )}
              {tvShow.vote_average > 0 && (
                <div className="backdrop-blur-card px-3 py-1.5 rounded-lg text-sm flex items-center border border-yellow-500/20 text-yellow-500">
                  <Star size={16} className="mr-1.5 fill-yellow-500" />
                  {tvShow.vote_average.toFixed(1)}
                </div>
              )}
            </div>

            {/* العنوان والسنة */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
              {tvShow.name}
              {firstAirYear && <span className="text-2xl text-gray-400 font-normal mr-3">({firstAirYear})</span>}
            </h1>

            {/* التصنيفات */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tvShow.genres?.map((genre) => (
                <Link 
                  key={genre.id} 
                  to={`/genre/${genre.id}?type=tv`}
                  className="text-sm font-medium py-1.5 px-3 bg-surface/30 backdrop-blur-sm rounded-lg text-gray-200 hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {/* وصف المسلسل */}
            <p className="text-gray-200 text-lg mb-8 max-w-2xl leading-relaxed">
              {tvShow.overview || "لا يوجد وصف متاح لهذا المسلسل."}
            </p>

            {/* معلومات إضافية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl">
              {tvShow.first_air_date && (
                <div className="flex items-center">
                  <Calendar className="text-accent mr-2 h-5 w-5" />
                  <div>
                    <div className="text-xs text-gray-400">تاريخ العرض الأول</div>
                    <div className="font-medium">{new Date(tvShow.first_air_date).toLocaleDateString('ar-EG')}</div>
                  </div>
                </div>
              )}
              
              {episodes > 0 && (
                <div className="flex items-center">
                  <ListOrdered className="text-accent mr-2 h-5 w-5" />
                  <div>
                    <div className="text-xs text-gray-400">عدد الحلقات</div>
                    <div className="font-medium">{episodes} حلقة</div>
                  </div>
                </div>
              )}
              
              {tvShow.vote_count > 0 && (
                <div className="flex items-center">
                  <Users className="text-accent mr-2 h-5 w-5" />
                  <div>
                    <div className="text-xs text-gray-400">عدد الأصوات</div>
                    <div className="font-medium">{tvShow.vote_count.toLocaleString('ar-EG')}</div>
                  </div>
                </div>
              )}
            </div>

            {/* أزرار العمل */}
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-accent hover:bg-accent/90 text-white px-6 py-6 rounded-lg flex items-center gap-2"
              >
                <PlayCircle size={20} className="ml-1" />
                مشاهدة الآن
              </Button>
              
              <Button
                onClick={() => toggleFavorite(tvShow)}
                variant="outline"
                className={`px-6 py-6 rounded-lg ${isFavorited ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface/30 backdrop-blur-sm'}`}
              >
                <Bookmark 
                  size={18} 
                  className="ml-2"
                  fill={isFavorited ? "currentColor" : "none"}
                />
                {isFavorited ? "في المفضلة" : "إضافة للمفضلة"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* مساحة إضافية أسفل قسم الهيرو */}
        <div className="h-10 md:h-16 lg:h-24 w-full"></div>
      </div>

      {/* علامات التبويب */}
      <div className="container mx-auto px-4 mb-8 mt-8 md:mt-16">
        <div className="border-b border-border">
          <nav className="flex -mb-px overflow-x-auto">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: <Info size={16} className="ml-1.5" /> },
              { id: 'cast', label: 'طاقم العمل', icon: <Users size={16} className="ml-1.5" /> },
              { id: 'episodes', label: 'المواسم والحلقات', icon: <ListOrdered size={16} className="ml-1.5" /> },
              { id: 'similar', label: 'مسلسلات مشابهة', icon: <Award size={16} className="ml-1.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id 
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* محتوى التبويب */}
        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* القسم الأيمن - الملصق وتفاصيل إضافية */}
              <div>
                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-xl mb-6">
                  <img
                    src={getImageUrl(tvShow.poster_path)}
                    alt={tvShow.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">معلومات إضافية</h3>
                  <div className="space-y-2 text-sm">
                    {tvShow.original_name && tvShow.original_name !== tvShow.name && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">الاسم الأصلي</span>
                        <span>{tvShow.original_name}</span>
                      </div>
                    )}
                    {tvShow.original_language && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">اللغة الأصلية</span>
                        <span>{tvShow.original_language === 'en' ? 'الإنجليزية' : tvShow.original_language}</span>
                      </div>
                    )}
                    {tvShow.type && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">النوع</span>
                        <span>{tvShow.type}</span>
                      </div>
                    )}
                    {tvShow.status && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">الحالة</span>
                        <span>{tvShow.status}</span>
                      </div>
                    )}
                    {tvShow.networks && tvShow.networks.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">الشبكة</span>
                        <span>{tvShow.networks[0].name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* القسم الأيسر - المعلومات التفصيلية */}
              <div className="md:col-span-2 space-y-8">
                <div className="glass-card p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">ملخص المسلسل</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {tvShow.overview || "لا يوجد وصف متاح لهذا المسلسل."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* تبويب طاقم العمل */}
          {activeTab === 'cast' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold mb-6">الممثلون</h3>
              
              {cast.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.slice(0, 15).map((actor) => (
                    <Link 
                      to={`/person/${actor.id}`} 
                      key={actor.id}
                      className="block"
                    >
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1">
                        <div className="aspect-[3/4] relative">
                          <Avatar className="w-full h-full rounded-none">
                            <AvatarImage 
                              src={getImageUrl(actor.profile_path)} 
                              alt={actor.name}
                              className="object-cover w-full h-full"
                            />
                            <AvatarFallback className="rounded-none bg-muted text-2xl h-full">
                              {actor.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold text-sm line-clamp-1">{actor.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{actor.character}</p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">لا توجد بيانات متوفرة عن طاقم التمثيل.</p>
              )}
            </div>
          )}
          
          {/* تبويب المواسم والحلقات */}
          {activeTab === 'episodes' && (
            <div>
              {tvShow.seasons && tvShow.seasons.length > 0 ? (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold mb-6">المواسم</h3>
                  <div className="space-y-4">
                    {tvShow.seasons.map((season) => (
                      <div key={season.id} className="glass-card p-4 rounded-lg flex flex-col md:flex-row gap-4">
                        {season.poster_path && (
                          <img 
                            src={getImageUrl(season.poster_path, "w200")} 
                            alt={season.name}
                            className="w-32 h-48 object-cover rounded-md flex-shrink-0 mx-auto md:mx-0"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between mb-2">
                            <h4 className="text-lg font-semibold">{season.name}</h4>
                            <div className="text-accent">
                              {season.episode_count} حلقة
                            </div>
                          </div>
                          
                          {season.air_date && (
                            <div className="text-sm text-gray-400 mb-2">
                              تاريخ العرض: {new Date(season.air_date).toLocaleDateString('ar-EG')}
                            </div>
                          )}
                          
                          <p className="text-gray-300 text-sm">
                            {season.overview || `لا يوجد وصف متاح للموسم ${season.season_number}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400">لا توجد معلومات عن المواسم متاحة</p>
                </div>
              )}
            </div>
          )}
          
          {/* تبويب المسلسلات المشابهة */}
          {activeTab === 'similar' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">مسلسلات مشابهة</h3>
              {similarShows && similarShows.results ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {similarShows.results.slice(0, 10).map((show) => (
                    <div key={show.id}>
                      <MovieCard movie={show} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">جاري تحميل المسلسلات المشابهة...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TvShowDetailsPage;


