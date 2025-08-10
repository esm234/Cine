import axios from "axios";
import { Movie, MovieListResponse, MovieDetailsResponse, YTSResponse, YTSMovieDetails, YTSMovie } from "@/types/movie";

// TMDB API يتطلب مفتاح API، استخدمنا مفتاح عام هنا لأغراض العرض
// في حالة واقعية يجب استخراج مفتاح خاص من موقعهم
const API_KEY = "51085745df829f9967134ab57a0bf892";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const YTS_API_URL = "https://yts.mx/api/v2";

export const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) {
    return "https://via.placeholder.com/500x750?text=No+Image";
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchTrending = async (mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week"): Promise<MovieListResponse> => {
  const response = await axios.get(`${BASE_URL}/trending/${mediaType}/${timeWindow}`, {
    params: {
      api_key: API_KEY,
      language: "ar"
    }
  });
  return response.data;
};

export const fetchTopRatedMovies = async (page: number = 1): Promise<MovieListResponse> => {
  const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      page
    }
  });
  return response.data;
};

export const fetchTopRatedTvShows = async (page: number = 1): Promise<MovieListResponse> => {
  const response = await axios.get(`${BASE_URL}/tv/top_rated`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      page
    }
  });
  return response.data;
};

export const fetchAsianMovies = async (page: number = 1): Promise<MovieListResponse> => {
  // استخدام الدول الآسيوية مثل (كوريا الجنوبية، اليابان، الصين، تايلاند)
  const response = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      with_original_language: "ko|ja|zh|th",
      sort_by: "popularity.desc",
      page
    }
  });
  return response.data;
};

export const fetchAsianTvShows = async (page: number = 1): Promise<MovieListResponse> => {
  const response = await axios.get(`${BASE_URL}/discover/tv`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      with_original_language: "ko|ja|zh|th",
      sort_by: "popularity.desc",
      page
    }
  });
  return response.data;
};

export const fetchOscarWinningMovies = async (page: number = 1): Promise<MovieListResponse> => {
  // استخدام شركات الإنتاج المعروفة بأفلام الأوسكار وتصنيف الأفلام حسب الشعبية
  // بالإضافة لتضمين الكلمات المفتاحية المرتبطة بالأوسكار
  const response = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      sort_by: "vote_average.desc",
      "vote_count.gte": 1000, // الحد الأدنى لعدد الأصوات للحصول على عينة موثوقة
      "vote_average.gte": 8, // الأفلام ذات التقييم العالي
      with_keywords: "207317|265|9914", // كلمات مفتاحية تتعلق بالأوسكار والجوائز
      page
    }
  });
  return response.data;
};

export const fetchMoviesByGenre = async (genreId: number, page: number = 1): Promise<MovieListResponse> => {
  const response = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      with_genres: genreId,
      page
    }
  });
  return response.data;
};

export const fetchTvShowsByGenre = async (genreId: number, page: number = 1): Promise<MovieListResponse> => {
  const response = await axios.get(`${BASE_URL}/discover/tv`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      with_genres: genreId,
      page
    }
  });
  return response.data;
};

export const fetchMovieDetails = async (id: number): Promise<MovieDetailsResponse> => {
  const response = await axios.get(`${BASE_URL}/movie/${id}`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      append_to_response: "videos,credits"
    }
  });
  return response.data;
};

export const fetchTvShowDetails = async (id: number): Promise<MovieDetailsResponse> => {
  const response = await axios.get(`${BASE_URL}/tv/${id}`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      append_to_response: "videos,credits"
    }
  });
  return response.data;
};

export const fetchPersonDetails = async (id: number): Promise<any> => {
  const response = await axios.get(`${BASE_URL}/person/${id}`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      append_to_response: "combined_credits"
    }
  });
  return response.data;
};

export const fetchPersonMovieCredits = async (id: number): Promise<any> => {
  const response = await axios.get(`${BASE_URL}/person/${id}/movie_credits`, {
    params: {
      api_key: API_KEY,
      language: "ar"
    }
  });
  return response.data;
};

export const fetchPersonTvCredits = async (id: number): Promise<any> => {
  const response = await axios.get(`${BASE_URL}/person/${id}/tv_credits`, {
    params: {
      api_key: API_KEY,
      language: "ar"
    }
  });
  return response.data;
};

export const searchMoviesAndTvShows = async (query: string): Promise<MovieListResponse> => {
  const response = await axios.get(`${BASE_URL}/search/multi`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      query
    }
  });
  return response.data;
};

export const fetchGenres = async (type: "movie" | "tv"): Promise<{genres: {id: number, name: string}[]}> => {
  const response = await axios.get(`${BASE_URL}/genre/${type}/list`, {
    params: {
      api_key: API_KEY,
      language: "ar"
    }
  });
  return response.data;
};

// دالة للبحث واستكشاف الأفلام والمسلسلات بناءً على معايير محددة
export const fetchDiscoverMovies = async ({
  mediaType = "movies",
  sortBy = "popularity.desc",
  year,
  withGenres,
  withRuntime,
  page = 1
}: {
  mediaType?: "movies" | "tvshows";
  sortBy?: string;
  year?: number;
  withGenres?: number;
  withRuntime?: {min: number, max: number};
  page?: number;
}): Promise<MovieListResponse> => {
  const type = mediaType === "movies" ? "movie" : "tv";
  const yearParam = mediaType === "movies" ? "primary_release_year" : "first_air_date_year";
  
  const response = await axios.get(`${BASE_URL}/discover/${type}`, {
    params: {
      api_key: API_KEY,
      language: "ar",
      sort_by: sortBy,
      ...(year && { [yearParam]: year }),
      ...(withGenres && { with_genres: withGenres }),
      ...(withRuntime && { "with_runtime.gte": withRuntime.min, "with_runtime.lte": withRuntime.max }),
      page
    }
  });
  return response.data;
};

// مجموعة أساسية من التصنيفات
export const COMMON_GENRES = [
  { id: 28, name: "أكشن" },
  { id: 18, name: "دراما" },
  { id: 35, name: "كوميدي" },
  { id: 27, name: "رعب" },
  { id: 10749, name: "رومانسي" },
  { id: 878, name: "خيال علمي" },
  { id: 16, name: "أنيمي" },
  { id: 99, name: "وثائقي" }
];

// دالة للبحث عن الأفلام في YTS بدقة أعلى
export const searchYTSMovies = async (movieTitle: string, year?: number): Promise<YTSResponse | null> => {
  try {
    // تحسين الدقة لأسماء الأفلام باللغة الإنجليزية
    const cleanTitle = movieTitle
      .replace(/[\u0600-\u06FF]/g, '') // إزالة الأحرف العربية
      .replace(/[^\w\s]/gi, '') // إزالة الرموز الخاصة
      .split(' ') 
      .filter(word => word.length > 1) // إزالة الكلمات القصيرة جدًا
      .join(' ')
      .trim();
      
    console.log("Searching for movie:", cleanTitle, "Year:", year);
    
    // إذا كان العنوان قصيرًا جدًا، نبحث مباشرة عن السنة
    const queryTerm = cleanTitle.length < 2 && year ? String(year) : cleanTitle;
    
    // استخدام API الرسمي للبحث عن الأفلام
    const response = await axios.get(`${YTS_API_URL}/list_movies.json`, {
      params: {
        query_term: queryTerm,
        limit: 10, // زيادة عدد النتائج
        sort_by: "download_count",
        order_by: "desc",
        ...(year && { year }) // إضافة السنة إذا كانت متاحة
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error searching YTS movies:", error);
    return null;
  }
};

// دالة للحصول على تفاصيل الفيلم من YTS
export const fetchYTSMovieDetails = async (movieId: number): Promise<YTSMovieDetails | null> => {
  try {
    const response = await axios.get(`${YTS_API_URL}/movie_details.json`, {
      params: {
        movie_id: movieId,
        with_images: true,
        with_cast: true
      }
    });
    
    if (response.data?.status === 'ok' && response.data?.data?.movie) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching YTS movie details:", error);
    return null;
  }
};

// دالة للحصول على اقتراحات أفلام مشابهة من YTS
export const fetchYTSMovieSuggestions = async (movieId: number): Promise<YTSResponse | null> => {
  try {
    const response = await axios.get(`${YTS_API_URL}/movie_suggestions.json`, {
      params: {
        movie_id: movieId
      }
    });
    
    if (response.data?.status === 'ok') {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching YTS movie suggestions:", error);
    return null;
  }
};

// دالة لإنشاء رابط مغناطيسي من بيانات YTS
export const createMagnetLink = (hash: string, title: string): string => {
  const encodedTitle = encodeURIComponent(title);
  return `magnet:?xt=urn:btih:${hash}&dn=${encodedTitle}`
    + `&tr=udp://glotorrents.pw:6969/announce`
    + `&tr=udp://tracker.opentrackr.org:1337/announce`
    + `&tr=udp://torrent.gresille.org:80/announce`
    + `&tr=udp://tracker.openbittorrent.com:80`
    + `&tr=udp://tracker.coppersurfer.tk:6969`
    + `&tr=udp://tracker.leechers-paradise.org:6969`
    + `&tr=udp://p4p.arenabg.ch:1337`
    + `&tr=udp://tracker.internetwarriors.net:1337`;
};

// دالة للحصول على الفيديو من TMDB
export const fetchMovieVideos = async (movieId: number): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return null;
  }
};

// دالة للحصول على تريلر الفيلم من TMDB
export const getMovieTrailer = async (movieId: number): Promise<string | null> => {
  try {
    const videosData = await fetchMovieVideos(movieId);
    
    if (videosData?.results && videosData.results.length > 0) {
      // البحث عن التريلر الرسمي أولاً
      const trailers = videosData.results.filter(
        (video: any) => 
          (video.type.toLowerCase() === 'trailer' || 
           video.type.toLowerCase() === 'teaser') && 
          video.site.toLowerCase() === 'youtube'
      );
      
      if (trailers.length > 0) {
        // استخدام أول تريلر
        return `https://www.youtube.com/embed/${trailers[0].key}`;
      }
      
      // إذا لم نجد تريلر، نستخدم أي فيديو من يوتيوب
      const youtubeVideos = videosData.results.filter(
        (video: any) => video.site.toLowerCase() === 'youtube'
      );
      
      if (youtubeVideos.length > 0) {
        return `https://www.youtube.com/embed/${youtubeVideos[0].key}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting movie trailer:", error);
    return null;
  }
};

// دالة للتحقق من توفر فيلم على YTS
export const checkYTSAvailability = async (imdbId: string): Promise<YTSMovie | null> => {
  try {
    // استخدام واجهة API للبحث بواسطة معرف IMDb
    const response = await axios.get(`${YTS_API_URL}/list_movies.json`, {
      params: {
        query_term: imdbId, // البحث باستخدام معرف IMDb مباشرة
        limit: 1
      }
    });
    
    if (response.data?.status === 'ok' && response.data?.data?.movie_count > 0) {
      return response.data.data.movies[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error checking YTS availability:", error);
    return null;
  }
};

// دالة لترشيح الأفلام بناءً على تفضيلات المستخدم
export const getRecommendedMovies = async ({
  genres = [],
  voteAverageMin = 0,
  voteAverageMax = 10,
  yearMin,
  yearMax,
  runtimeMin,
  runtimeMax,
  withDirectors = [],
  withCast = [],
  page = 1,
  limit = 10
}: {
  genres?: number[];
  voteAverageMin?: number;
  voteAverageMax?: number;
  yearMin?: number;
  yearMax?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  withDirectors?: number[];
  withCast?: number[];
  page?: number;
  limit?: number;
}): Promise<MovieListResponse> => {
  try {
    const currentYear = new Date().getFullYear();
    
    // تكوين معايير البحث
    const params: any = {
      api_key: API_KEY,
      language: "ar",
      sort_by: "popularity.desc",
      "vote_average.gte": voteAverageMin,
      "vote_average.lte": voteAverageMax,
      "vote_count.gte": 100, // للتأكد من أن الأفلام لها تقييمات كافية
      page,
      include_adult: false
    };
    
    // إضافة نطاق السنوات إذا تم تحديده
    if (yearMin) {
      params["primary_release_date.gte"] = `${yearMin}-01-01`;
    }
    
    if (yearMax) {
      params["primary_release_date.lte"] = `${yearMax}-12-31`;
    }
    
    // إضافة نطاق مدة الفيلم إذا تم تحديده
    if (runtimeMin) {
      params["with_runtime.gte"] = runtimeMin;
    }
    
    if (runtimeMax) {
      params["with_runtime.lte"] = runtimeMax;
    }
    
    // إضافة التصنيفات إذا تم تحديدها
    if (genres && genres.length > 0) {
      params.with_genres = genres.join('|');
    }
    
    // إضافة المخرجين إذا تم تحديدهم (يمكن استخدام معرف واحد فقط للمخرج)
    if (withDirectors && withDirectors.length > 0) {
      params.with_crew = withDirectors[0]; // TMDB API يدعم معرف واحد فقط
    }
    
    // إضافة الممثلين إذا تم تحديدهم
    if (withCast && withCast.length > 0) {
      params.with_cast = withCast.slice(0, 2).join(','); // TMDB API يدعم عدد محدود من الممثلين
    }
    
    const response = await axios.get(`${BASE_URL}/discover/movie`, { params });
    return response.data;
  } catch (error) {
    console.error("Error getting recommended movies:", error);
    throw error;
  }
};

// دالة لاستخراج المخرجين من طاقم العمل
export const extractDirectors = (crew: any[]): any[] => {
  if (!crew || !Array.isArray(crew)) return [];
  return crew.filter(person => person.job === 'Director');
};

// دالة لتحليل الأفلام المفضلة واستخراج المخرجين والممثلين المشتركين
export const analyzeFavoriteMovies = async (movies: Movie[]) => {
  // تحليل المخرجين والممثلين يتطلب تفاصيل كاملة للأفلام
  const movieDetails = await Promise.all(
    movies.map(async (movie) => {
      try {
        if (movie.title || movie.media_type === "movie") {
          const details = await fetchMovieDetails(movie.id);
          return details;
        } else if (movie.name || movie.media_type === "tv") {
          const details = await fetchTvShowDetails(movie.id);
          return details;
        }
        return null;
      } catch (error) {
        console.error(`Error fetching details for movie/show ${movie.id}:`, error);
        return null;
      }
    })
  );

  const validMovieDetails = movieDetails.filter(Boolean);
  
  // تحليل المخرجين
  const directorCounts: Record<number, { count: number; director: any }> = {};
  validMovieDetails.forEach(movie => {
    if (movie?.credits?.crew) {
      const directors = extractDirectors(movie.credits.crew);
      directors.forEach(director => {
        if (!directorCounts[director.id]) {
          directorCounts[director.id] = { count: 0, director };
        }
        directorCounts[director.id].count++;
      });
    }
  });

  // تحليل الممثلين
  const actorCounts: Record<number, { count: number; actor: any }> = {};
  validMovieDetails.forEach(movie => {
    if (movie?.credits?.cast) {
      // أخذ أول 5 ممثلين فقط من كل فيلم
      const mainCast = movie.credits.cast.slice(0, 5);
      mainCast.forEach(actor => {
        if (!actorCounts[actor.id]) {
          actorCounts[actor.id] = { count: 0, actor };
        }
        actorCounts[actor.id].count++;
      });
    }
  });

  // ترتيب المخرجين والممثلين حسب التكرار
  const topDirectors = Object.values(directorCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(item => ({ 
      id: item.director.id,
      name: item.director.name,
      count: item.count,
      profile_path: item.director.profile_path
    }));

  const topActors = Object.values(actorCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => ({ 
      id: item.actor.id,
      name: item.actor.name,
      count: item.count,
      profile_path: item.actor.profile_path
    }));

  return {
    topDirectors,
    topActors
  };
};
