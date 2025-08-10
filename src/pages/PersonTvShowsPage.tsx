import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import { fetchPersonDetails, fetchPersonTvCredits } from "@/services/api";

const PersonTvShowsPage = () => {
  const { id } = useParams<{ id: string }>();
  const personId = parseInt(id || "0");

  // جلب بيانات الممثل
  const { data: personDetails } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => fetchPersonDetails(personId),
    enabled: !!personId
  });

  // جلب كل المسلسلات
  const { data: tvCredits, isLoading: isLoadingTvShows } = useQuery({
    queryKey: ["person", personId, "tv"],
    queryFn: () => fetchPersonTvCredits(personId),
    enabled: !!personId
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          كل المسلسلات لـ {personDetails?.name || "الممثل"}
        </h1>
        <MovieGrid
          movies={tvCredits?.cast || []}
          isLoading={isLoadingTvShows}
          emptyMessage="لا توجد مسلسلات لهذا الممثل."
        />
      </div>
    </Layout>
  );
};

export default PersonTvShowsPage; 