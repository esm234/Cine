import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoPlayerProps {
  tmdbId: number;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
}

// قائمة بمصادر الفيديو المحدثة والموثوقة
const videoSources = [
  {
    id: "vidsrc-rip",
    name: "VidSrc Pro",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://vidsrc.rip/embed/movie/${tmdbId}`;
      } else {
        return `https://vidsrc.rip/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`;
      }
    },
    quality: "عالية جداً",
    ads: "محظورة"
  },
  {
    id: "vidsrc-cc",
    name: "VidSrc Ultra",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;
      } else {
        return `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`;
      }
    },
    quality: "عالية جداً",
    ads: "محظورة"
  },
  {
    id: "vidsrc-me",
    name: "VidSrc ME",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      } else {
        return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
      }
    },
    quality: "عالية",
    ads: "محظورة"
  },
  {
    id: "vidsrc-net",
    name: "VidSrc NET",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://vidsrc.net/embed/movie?tmdb=${tmdbId}`;
      } else {
        return `https://vidsrc.net/embed/tv?tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
      }
    },
    quality: "عالية",
    ads: "محظورة"
  }
];

const VidsrcPlayer = ({ tmdbId, type = "movie", season, episode }: VideoPlayerProps) => {
  const [selectedSource, setSelectedSource] = useState(videoSources[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);

  // ضبط ارتفاع المشغل بناءً على عرض الشاشة
  React.useEffect(() => {
    const updatePlayerHeight = () => {
      // الحفاظ على نسبة العرض إلى الارتفاع 16:9
      const playerContainer = document.getElementById('player-container');
      if (playerContainer) {
        const width = playerContainer.clientWidth;
        setPlayerHeight(width * 0.5625); // 9/16 = 0.5625
      }
    };

    // تحديث الارتفاع عند تحميل الصفحة وتغيير حجم النافذة
    updatePlayerHeight();
    window.addEventListener('resize', updatePlayerHeight);
    
    return () => {
      window.removeEventListener('resize', updatePlayerHeight);
    };
  }, []);

  const handleSourceChange = (source: typeof videoSources[0]) => {
    setIsLoading(true);
    setSelectedSource(source);
    // تأخير صغير لإظهار حالة التحميل
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/70">مصدر المشاهدة:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-black/50 border-white/10 text-white flex items-center gap-2">
                {selectedSource.name}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/80 backdrop-blur-md border-white/10">
              {videoSources.map((source) => (
                <DropdownMenuItem
                  key={source.id}
                  onClick={() => handleSourceChange(source)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span>{source.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/60">{source.quality}</span>
                      <span className={`text-xs ${source.ads.includes("محظورة") ? "text-green-500" : "text-yellow-500"}`}>
                        {source.ads}
                      </span>
                    </div>
                  </div>
                  {selectedSource.id === source.id && (
                    <Check size={16} className="text-accent" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-xs text-white/60 hidden sm:block">
          * بعض المصادر قد تكون أسرع أو أفضل جودة من غيرها
        </div>
      </div>

      <div 
        id="player-container"
        className="w-full rounded-lg overflow-hidden relative bg-black/30 shadow-lg"
      >
        {isLoading ? (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ height: playerHeight ? `${playerHeight}px` : '56.25vw' }}
          >
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : null}
        <div className="aspect-video w-full relative">
          <iframe
            src={selectedSource.getUrl({ tmdbId, type, season, episode })}
            allowFullScreen
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            title={type === "movie" ? "مشاهدة الفيلم" : "مشاهدة المسلسل"}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}
          ></iframe>
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <div className="text-sm text-white/70 flex flex-col gap-2">
          <p className="font-medium text-accent">نصائح للمشاهدة بدون إعلانات:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>استخدم متصفح يدعم مانع الإعلانات مثل Brave أو Firefox مع إضافة uBlock Origin</li>
            <li>جرب مصادر مختلفة إذا واجهت مشاكل في التشغيل</li>
            <li>بعض المصادر تعمل بشكل أفضل على أجهزة معينة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VidsrcPlayer; 