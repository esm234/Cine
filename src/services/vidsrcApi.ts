// خدمة API لاستخراج روابط vidsrc نظيفة
interface VidsrcApiResponse {
  success: boolean;
  data?: {
    name: string;
    image: string;
    mediaId: string;
    stream: string;
    referer: string;
    subtitles?: SubtitleTrack[];
  }[];
  error?: string;
}

interface SubtitleTrack {
  id: string;
  language: string;
  languageCode: string;
  label: string;
  url: string;
  format: "srt" | "vtt" | "ass";
}

class VidsrcApiService {
  private baseUrl = 'http://localhost:3001'; // سيتم تحديثه للإنتاج

  async getMovieStream(tmdbId: number): Promise<VidsrcApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/movie/${tmdbId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie stream:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getTvStream(tmdbId: number, season: number, episode: number): Promise<VidsrcApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tv/${tmdbId}/${season}/${episode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching TV stream:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // استخراج روابط مباشرة من vidsrc (طريقة بديلة)
  async getDirectStream(tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number): Promise<string[]> {
    const streams: string[] = [];
    
    // مصادر vidsrc المختلفة
    const sources = [
      {
        name: 'vidsrc.me',
        getUrl: () => {
          if (type === 'movie') {
            return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
          } else {
            return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
          }
        }
      },
      {
        name: 'vidsrc.net',
        getUrl: () => {
          if (type === 'movie') {
            return `https://vidsrc.net/embed/movie?tmdb=${tmdbId}`;
          } else {
            return `https://vidsrc.net/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
          }
        }
      },
      {
        name: 'vidsrc.xyz',
        getUrl: () => {
          if (type === 'movie') {
            return `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`;
          } else {
            return `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
          }
        }
      }
    ];

    // إضافة الروابط المباشرة
    sources.forEach(source => {
      streams.push(source.getUrl());
    });

    return streams;
  }

  // الحصول على ترجمات من مصادر مختلفة
  async getSubtitles(tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number): Promise<SubtitleTrack[]> {
    const subtitles: SubtitleTrack[] = [];

    try {
      // محاولة الحصول على ترجمات من OpenSubtitles (مثال)
      const openSubtitlesUrl = type === 'movie' 
        ? `https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${tmdbId}&type=movie`
        : `https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${tmdbId}&type=episode&season_number=${season}&episode_number=${episode}`;

      // في التطبيق الحقيقي، ستحتاج إلى API key صحيح
      // const response = await fetch(openSubtitlesUrl, {
      //   headers: {
      //     'Api-Key': 'YOUR_API_KEY',
      //     'Content-Type': 'application/json'
      //   }
      // });

      // ترجمات افتراضية للاختبار
      const defaultSubtitles: SubtitleTrack[] = [
        {
          id: 'ar-default',
          language: 'العربية',
          languageCode: 'ar',
          label: 'Arabic',
          url: `https://example.com/subtitles/${tmdbId}/ar.srt`,
          format: 'srt'
        },
        {
          id: 'en-default',
          language: 'English',
          languageCode: 'en',
          label: 'English',
          url: `https://example.com/subtitles/${tmdbId}/en.srt`,
          format: 'srt'
        }
      ];

      subtitles.push(...defaultSubtitles);
    } catch (error) {
      console.error('Error fetching subtitles:', error);
    }

    return subtitles;
  }

  // فحص حالة الخدمة
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  // تحديث URL الأساسي للإنتاج
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const vidsrcApi = new VidsrcApiService();

// تصدير الأنواع للاستخدام في مكونات أخرى
export type { VidsrcApiResponse, SubtitleTrack };

