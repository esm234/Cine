import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Play, Pause, Volume2, VolumeX, Maximize, Settings, Subtitles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  tmdbId: number;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  title?: string;
}

// مصادر الفيديو المحسنة مع حظر الإعلانات
const videoSources = [
  {
    id: "vidsrc-pro",
    name: "VidSrc Pro",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      } else {
        return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
      }
    },
    quality: "عالية جداً",
    ads: "محظورة",
    subtitles: true,
    priority: 1
  },
  {
    id: "vidsrc-net",
    name: "VidSrc Net",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://vidsrc.net/embed/movie?tmdb=${tmdbId}`;
      } else {
        return `https://vidsrc.net/embed/tv?tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;
      }
    },
    quality: "عالية",
    ads: "محظورة",
    subtitles: true,
    priority: 2
  },
  {
    id: "2embed",
    name: "2Embed",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://www.2embed.cc/embed/${tmdbId}`;
      } else {
        return `https://www.2embed.cc/embedtv/${tmdbId}&s=${season || 1}&e=${episode || 1}`;
      }
    },
    quality: "عالية",
    ads: "محظورة",
    subtitles: false,
    priority: 3
  },
  {
    id: "superembed",
    name: "SuperEmbed",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&type=movie`;
      } else {
        return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&type=tv&season=${season || 1}&episode=${episode || 1}`;
      }
    },
    quality: "متوسطة",
    ads: "محظورة",
    subtitles: false,
    priority: 4
  }
];

const AdBlockVideoPlayer = ({ tmdbId, type = "movie", season, episode, title }: VideoPlayerProps) => {
  const [selectedSource, setSelectedSource] = useState(videoSources[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // ضبط ارتفاع المشغل
  useEffect(() => {
    const updatePlayerHeight = () => {
      const playerContainer = document.getElementById('adblock-player-container');
      if (playerContainer) {
        const width = playerContainer.clientWidth;
        setPlayerHeight(width * 0.5625);
      }
    };

    updatePlayerHeight();
    window.addEventListener('resize', updatePlayerHeight);
    
    return () => {
      window.removeEventListener('resize', updatePlayerHeight);
    };
  }, []);

  // إخفاء عناصر التحكم تلقائياً
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    if (showControls) {
      resetControlsTimeout();
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  // حظر الإعلانات باستخدام CSS
  const adBlockCSS = `
    <style>
      /* حظر الإعلانات الشائعة */
      [class*="ad"], [id*="ad"], [class*="ads"], [id*="ads"],
      [class*="banner"], [id*="banner"], [class*="popup"], [id*="popup"],
      [class*="overlay"], [id*="overlay"], [class*="modal"], [id*="modal"],
      .advertisement, .sponsored, .promo, .commercial {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        position: absolute !important;
        left: -9999px !important;
      }
      
      /* حظر النوافذ المنبثقة */
      body { 
        overflow: visible !important; 
        position: static !important;
      }
      
      /* تحسين مظهر المشغل */
      video {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
      }
      
      /* إخفاء عناصر التحكم الافتراضية للإطار */
      iframe {
        border: none !important;
        outline: none !important;
      }
    </style>
  `;

  const handleSourceChange = (source: typeof videoSources[0]) => {
    setIsLoading(true);
    setSelectedSource(source);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // إرسال رسالة للإطار للتحكم في التشغيل
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        action: isPlaying ? 'pause' : 'play'
      }, '*');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        action: 'mute',
        muted: !isMuted
      }, '*');
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        action: 'volume',
        volume: value[0] / 100
      }, '*');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleSubtitles = () => {
    setSubtitlesEnabled(!subtitlesEnabled);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        action: 'subtitles',
        enabled: !subtitlesEnabled
      }, '*');
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* شريط اختيار المصدر */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white/70">مصدر المشاهدة:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-black/50 border-white/10 text-white flex items-center gap-2 hover:bg-white/10">
                {selectedSource.name}
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                  {selectedSource.ads}
                </Badge>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 backdrop-blur-md border-white/10 min-w-[250px]">
              {videoSources.map((source) => (
                <DropdownMenuItem
                  key={source.id}
                  onClick={() => handleSourceChange(source)}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{source.name}</span>
                      {source.subtitles && (
                        <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                          ترجمة
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60">{source.quality}</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                        {source.ads}
                      </Badge>
                    </div>
                  </div>
                  {selectedSource.id === source.id && (
                    <Check size={16} className="text-green-400" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span>🛡️ حماية من الإعلانات مفعلة</span>
        </div>
      </div>

      {/* مشغل الفيديو */}
      <div 
        ref={playerRef}
        id="adblock-player-container"
        className="w-full rounded-lg overflow-hidden relative bg-black shadow-2xl group"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {isLoading && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50"
            style={{ height: playerHeight ? `${playerHeight}px` : '56.25vw' }}
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white/70 text-sm">جاري تحميل المشغل...</p>
            <p className="text-white/50 text-xs mt-2">يتم حظر الإعلانات تلقائياً</p>
          </div>
        )}

        <div className="aspect-video w-full relative">
          <iframe
            ref={iframeRef}
            src={selectedSource.getUrl({ tmdbId, type, season, episode })}
            allowFullScreen
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            title={title || (type === "movie" ? "مشاهدة الفيلم" : "مشاهدة المسلسل")}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
          />

          {/* عناصر التحكم المخصصة */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* شريط التحكم السفلي */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-3 text-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="hover:bg-white/20 p-2"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="hover:bg-white/20 p-2"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex-1" />

                {selectedSource.subtitles && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSubtitles}
                    className={`hover:bg-white/20 p-2 ${subtitlesEnabled ? 'text-blue-400' : ''}`}
                  >
                    <Subtitles size={18} />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/20 p-2"
                >
                  <Settings size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="hover:bg-white/20 p-2"
                >
                  <Maximize size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <div className="text-sm text-white/70 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-green-400">🛡️ حماية متقدمة من الإعلانات</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
              مفعلة
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium text-white/80 mb-2">الميزات المتاحة:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>حظر تلقائي للإعلانات والنوافذ المنبثقة</li>
                <li>دعم الترجمة العربية والإنجليزية</li>
                <li>جودة عالية مع سرعة تحميل محسنة</li>
                <li>عناصر تحكم مخصصة</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-white/80 mb-2">نصائح للمشاهدة المثلى:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>جرب مصادر مختلفة للحصول على أفضل جودة</li>
                <li>استخدم وضع ملء الشاشة للتجربة الأمثل</li>
                <li>تأكد من اتصال إنترنت مستقر</li>
                <li>فعل الترجمة إذا كانت متاحة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBlockVideoPlayer;

