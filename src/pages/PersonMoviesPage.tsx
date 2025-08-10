import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import MovieGrid from "@/components/MovieGrid";
import { fetchPersonDetails, fetchPersonMovieCredits } from "@/services/api";

const PersonMoviesPage = () => {
  const { id } = useParams<{ id: string }>();
  const personId = parseInt(id || "0");

  // جلب بيانات الممثل
  const { data: personDetails, isLoading: isLoadingPerson } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => fetchPersonDetails(personId),
    enabled: !!personId
  });

  // جلب كل أفلام الممثل
  const { data: movieCredits, isLoading: isLoadingMovies } = useQuery({
    queryKey: ["person", personId, "movies"],
    queryFn: () => fetchPersonMovieCredits(personId),
    enabled: !!personId
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          كل أفلام {personDetails?.name || "الممثل"}
        </h1>
        <MovieGrid
          movies={movieCredits?.cast || []}
          isLoading={isLoadingMovies}
          emptyMessage="لا توجد أفلام لهذا الممثل."
        />
      </div>
    </Layout>
  );
};

export default PersonMoviesPage; 