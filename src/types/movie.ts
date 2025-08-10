export interface Movie {
  id: number;
  title: string;
  name?: string; // للمسلسلات
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string; // للمسلسلات
  vote_average: number;
  vote_count?: number; // عدد الأصوات
  genre_ids: number[];
  media_type?: string;
  runtime?: number; // لمدة الفيلم بالدقائق
  number_of_seasons?: number; // لعدد المواسم
  original_title?: string; // العنوان الأصلي للفيلم (غالبًا باللغة الإنجليزية)
  directors?: Person[]; // المخرجين
  cast?: Person[]; // طاقم التمثيل
}

export interface Person {
  id: number;
  name: string;
  profile_path?: string;
  job?: string; // للمخرجين
  character?: string; // للممثلين
  popularity?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Credit {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}

export interface MovieDetailsResponse extends Movie {
  genres: Genre[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  credits?: {
    cast: Person[];
    crew: Person[];
  };
  imdb_id?: string;
  // حقول إضافية مستخدمة في الواجهات
  revenue?: number;
  budget?: number;
  recommendations?: { results: Movie[] };
  original_name?: string;
  original_language?: string;
  status?: string;
  type?: string;
  networks?: { name: string }[];
  seasons?: {
    id: number;
    name: string;
    poster_path: string | null;
    episode_count: number;
    air_date?: string;
    overview?: string;
    season_number: number;
  }[];
}

export interface YTSTorrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}

export interface YTSMovie {
  id: number;
  url: string;
  imdb_code: string;
  title: string;
  title_english: string;
  title_long: string;
  slug: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  summary: string;
  description_full: string;
  synopsis: string;
  language: string;
  background_image: string;
  background_image_original: string;
  small_cover_image: string;
  medium_cover_image: string;
  large_cover_image: string;
  torrents: YTSTorrent[];
  date_uploaded: string;
  date_uploaded_unix: number;
}

export interface YTSResponse {
  status: string;
  status_message: string;
  data: {
    movie_count: number;
    limit: number;
    page_number: number;
    movies: YTSMovie[];
  };
}

export interface YTSMovieDetails {
  status: string;
  status_message: string;
  data: {
    movie: YTSMovie & {
      cast?: {
        name: string;
        character_name: string;
        url_small_image: string;
        imdb_code: string;
      }[];
      directors?: {
        name: string;
        small_image: string;
        imdb_code: string;
      }[];
      download_count: number;
      like_count: number;
    };
  };
}
