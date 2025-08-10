import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import {
  fetchPersonDetails,
  fetchPersonMovieCredits,
  fetchPersonTvCredits,
  getImageUrl
} from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Film, Tv, Calendar, MapPin, User } from "lucide-react";
import MovieSlider from "@/components/MovieSlider";

const PersonDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const personId = parseInt(id || "0");
  const [activeTab, setActiveTab] = useState("about");

  // الحصول على معلومات الممثل
  const {
    data: personDetails,
    isLoading: isLoadingPerson,
    error: personError
  } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => fetchPersonDetails(personId),
    enabled: !!personId
  });

  // الحصول على أفلام الممثل
  const {
    data: movieCredits,
    isLoading: isLoadingMovies,
    error: moviesError
  } = useQuery({
    queryKey: ["person", personId, "movies"],
    queryFn: () => fetchPersonMovieCredits(personId),
    enabled: !!personId
  });

  // الحصول على مسلسلات الممثل
  const {
    data: tvCredits,
    isLoading: isLoadingTvShows,
    error: tvShowsError
  } = useQuery({
    queryKey: ["person", personId, "tv"],
    queryFn: () => fetchPersonTvCredits(personId),
    enabled: !!personId
  });

  // في حالة الخطأ
  if (personError) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-2xl text-red-500 mb-4">خطأ في تحميل البيانات</h1>
          <p className="text-gray-400">لا يمكن عرض بيانات هذا الممثل حالياً، الرجاء المحاولة مرة أخرى لاحقاً.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pb-10">
        {/* قسم المعلومات الرئيسية */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* صورة الممثل */}
          <motion.div
            className="w-full md:w-1/3 lg:w-1/4"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {isLoadingPerson ? (
              <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
            ) : (
              <img
                src={getImageUrl(personDetails?.profile_path, "h632")}
                alt={personDetails?.name}
                className="rounded-2xl w-full h-auto object-cover shadow-lg"
              />
            )}
          </motion.div>

          {/* معلومات الممثل */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isLoadingPerson ? (
              <>
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-6" />
                <Skeleton className="h-24 w-full mb-4" />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4 text-accent">
                  {personDetails?.name}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
                  {personDetails?.birthday && (
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>تاريخ الميلاد: {new Date(personDetails.birthday).toLocaleDateString('ar-EG')}</span>
                    </div>
                  )}
                  
                  {personDetails?.place_of_birth && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>مكان الميلاد: {personDetails.place_of_birth}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">نبذة</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {personDetails?.biography || "لا توجد معلومات متاحة عن هذا الممثل."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">المعلومات الشخصية</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {personDetails?.known_for_department && (
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-accent" />
                        <span>المهنة: {personDetails.known_for_department}</span>
                      </div>
                    )}
                    
                    {personDetails?.gender !== undefined && (
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-accent" />
                        <span>الجنس: {personDetails.gender === 1 ? "أنثى" : "ذكر"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* تبويبات الأفلام والمسلسلات */}
        <Tabs 
          defaultValue="movies" 
          className="mt-8"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="movies" className="text-lg">
              <Film className="ml-2 h-4 w-4" />
              الأفلام
            </TabsTrigger>
            <TabsTrigger value="tvshows" className="text-lg">
              <Tv className="ml-2 h-4 w-4" />
              المسلسلات
            </TabsTrigger>
          </TabsList>

          {/* محتوى تبويب الأفلام */}
          <TabsContent value="movies" className="space-y-8">
            {/* أفلام كممثل */}
            <div>
              {movieCredits?.cast && movieCredits.cast.length > 0 ? (
                <>
                <MovieSlider
                  title="أبرز الأفلام"
                  movies={movieCredits.cast.slice(0, 15)}
                  isLoading={isLoadingMovies}
                />
                  <div className="flex justify-center mt-4">
                    <Link
                      to={`/person/${personId}/movies`}
                      className="px-4 py-2 rounded bg-accent text-white hover:bg-accent/80 transition"
                    >
                      عرض كل الأفلام
                    </Link>
                  </div>
                </>
              ) : isLoadingMovies ? (
                <div className="flex gap-4 overflow-hidden my-8">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="min-w-[200px] h-[300px] rounded-xl" />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">لا توجد أفلام لعرضها.</p>
              )}
            </div>
          </TabsContent>

          {/* محتوى تبويب المسلسلات */}
          <TabsContent value="tvshows" className="space-y-8">
            {/* مسلسلات كممثل */}
            <div>
              {tvCredits?.cast && tvCredits.cast.length > 0 ? (
                <>
                <MovieSlider
                  title="أبرز المسلسلات"
                  movies={tvCredits.cast.slice(0, 15)}
                  isLoading={isLoadingTvShows}
                />
                  <div className="flex justify-center mt-4">
                    <Link
                      to={`/person/${personId}/tvshows`}
                      className="px-4 py-2 rounded bg-accent text-white hover:bg-accent/80 transition"
                    >
                      عرض كل المسلسلات
                    </Link>
                  </div>
                </>
              ) : isLoadingTvShows ? (
                <div className="flex gap-4 overflow-hidden my-8">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="min-w-[200px] h-[300px] rounded-xl" />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">لا توجد مسلسلات لعرضها.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PersonDetailsPage; 