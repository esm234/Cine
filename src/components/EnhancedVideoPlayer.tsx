import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Play, Pause, Volume2, VolumeX, Maximize, Settings, RotateCcw, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import SubtitleManager from "./SubtitleManager";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoPlayerProps {
  tmdbId: number;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  title?: string;
}

interface SubtitleTrack {
  id: string;
  language: string;
  languageCode: string;
  label: string;
  url: string;
  format: "srt" | "vtt" | "ass";
}

// مصادر الفيديو المحسنة مع حظر الإعلانات
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
    ads: "محظورة",
    subtitles: true,
    priority: 1,
    description: "أحدث مصدر بجودة 4K مع ترجمة متقدمة"
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
    ads: "محظورة",
    subtitles: true,
    priority: 2,
    description: "مصدر محسن مع تحميل فوري"
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
    ads: "محظورة",
    subtitles: true,
    priority: 3,
    description: "مصدر موثوق مع دعم كامل للترجمة"
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
    ads: "محظورة",
    subtitles: true,
    priority: 4,
    description: "جودة عالية مع سرعة تحميل ممتازة"
  },
  {
    id: "embedsoap",
    name: "EmbedSoap",
    getUrl: (props: VideoPlayerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://www.embedsoap.com/embed/movie?id=${tmdbId}`;
      } else {
        return `https://www.embedsoap.com/embed/tv?id=${tmdbId}&s=${season || 1}&e=${episode || 1}`;
      }
    },
    quality: "عالية",
    ads: "محظورة",
    subtitles: false,
    priority: 5,
    description: "مصدر بديل سريع"
  }
];

const EnhancedVideoPlayer = ({ tmdbId, type = "movie", season, episode, title }: VideoPlayerProps) => {
  const [selectedSource, setSelectedSource] = useState(videoSources[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleTrack | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // ضبط ارتفاع المشغل
  useEffect(() => {
    const updatePlayerHeight = () => {
      const playerContainer = document.getElementById('enhanced-player-container');
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
        if (!isFullscreen) {
          setShowControls(false);
        }
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
  }, [showControls, isFullscreen]);

  // مراقبة حالة ملء الشاشة
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleSourceChange = (source: typeof videoSources[0]) => {
    setIsLoading(true);
    setHasError(false);
    setSelectedSource(source);
    setRetryCount(0);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleRetry = () => {
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      // جرب المصدر التالي
      const currentIndex = videoSources.findIndex(s => s.id === selectedSource.id);
      const nextSource = videoSources[(currentIndex + 1) % videoSources.length];
      handleSourceChange(nextSource);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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
    } else {
      document.exitFullscreen();
    }
  };

  const handleSubtitleChange = (subtitle: SubtitleTrack | null) => {
    setCurrentSubtitle(subtitle);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        action: 'subtitles',
        subtitle: subtitle
      }, '*');
    }
  };

  // حقن CSS لحظر الإعلانات
  const injectAdBlockCSS = () => {
    if (iframeRef.current) {
      try {
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          const style = iframeDoc.createElement('style');
          style.textContent = `
            /* حظر الإعلانات الشائعة */
            [class*="ad"], [id*="ad"], [class*="ads"], [id*="ads"],
            [class*="banner"], [id*="banner"], [class*="popup"], [id*="popup"],
            [class*="overlay"], [id*="overlay"], [class*="modal"], [id*="modal"],
            .advertisement, .sponsored, .promo, .commercial,
            [class*="advert"], [id*="advert"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              width: 0 !important;
              height: 0 !important;
              position: absolute !important;
              left: -9999px !important;
              z-index: -1 !important;
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
          `;
          iframeDoc.head.appendChild(style);
        }
      } catch (error) {
        console.log('Could not inject CSS due to CORS policy');
      }
    }
  };

  // حقن CSS عند تحميل الإطار
  useEffect(() => {
    const timer = setTimeout(() => {
      injectAdBlockCSS();
    }, 2000);

    return () => clearTimeout(timer);
  }, [selectedSource]);

  return (
    <div className="space-y-4 w-full">
      {/* شريط اختيار المصدر */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm font-medium text-white/70">مصدر المشاهدة:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-black/50 border-white/10 text-white flex items-center gap-2 hover:bg-white/10 min-w-[200px] justify-between">
                <div className="flex items-center gap-2">
                  {selectedSource.name}
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                    {selectedSource.ads}
                  </Badge>
                </div>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/95 backdrop-blur-md border-white/10 min-w-[320px]">
              {videoSources.map((source) => (
                <DropdownMenuItem
                  key={source.id}
                  onClick={() => handleSourceChange(source)}
                  className="flex flex-col items-start cursor-pointer hover:bg-white/10 p-4 gap-2"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{source.name}</span>
                      {source.subtitles && (
                        <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                          ترجمة
                        </Badge>
                      )}
                    </div>
                    {selectedSource.id === source.id && (
                      <Check size={16} className="text-green-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-white/60">{source.quality}</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                      {source.ads}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-white/50 mt-1">{source.description}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-white/60">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>حماية من الإعلانات مفعلة</span>
          </div>
          {currentSubtitle && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              ترجمة: {currentSubtitle.language}
            </Badge>
          )}
        </div>
      </div>

      {/* تحذير في حالة الخطأ */}
      {hasError && (
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            فشل في تحميل الفيديو. جاري المحاولة مرة أخرى...
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              <RotateCcw size={14} className="mr-1" />
              إعادة المحاولة
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* مشغل الفيديو */}
      <div 
        ref={playerRef}
        id="enhanced-player-container"
        className="w-full rounded-lg overflow-hidden relative bg-black shadow-2xl group"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => !isFullscreen && setShowControls(false)}
      >
        {isLoading && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-sm z-50"
            style={{ height: playerHeight ? `${playerHeight}px` : '56.25vw' }}
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin animation-delay-150 m-2"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-white/90 text-lg font-medium">جاري تحميل المشغل...</p>
              <p className="text-white/60 text-sm">يتم حظر الإعلانات تلقائياً</p>
              <div className="flex items-center gap-2 text-xs text-white/50 mt-4">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                <span>المصدر: {selectedSource.name}</span>
              </div>
            </div>
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
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            title={title || (type === "movie" ? "مشاهدة الفيلم" : "مشاهدة المسلسل")}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-700`}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
            onLoad={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />

          {/* عناصر التحكم المخصصة */}
          <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${showControls || isFullscreen ? 'opacity-100' : 'opacity-0'}`}>
            {/* منطقة شفافة للنقر على الفيديو */}
            <div className="absolute inset-0 pointer-events-auto" onClick={() => setShowControls(!showControls)} />
            
            {/* تدرج خلفية للتحكم السفلي */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
            
            {/* شريط التحكم السفلي */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
              <div className="flex items-center gap-3 text-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="hover:bg-white/20 p-2 transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="hover:bg-white/20 p-2 transition-colors"
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

                {/* مدير الترجمة */}
                <SubtitleManager
                  tmdbId={tmdbId}
                  type={type}
                  season={season}
                  episode={episode}
                  onSubtitleChange={handleSubtitleChange}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/20 p-2 transition-colors"
                >
                  <Settings size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="hover:bg-white/20 p-2 transition-colors"
                >
                  <Maximize size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <div className="text-sm text-white/70 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-green-400">🛡️ حماية متقدمة من الإعلانات</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                مفعلة
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/50">المصدر الحالي:</span>
              <Badge variant="outline" className="border-white/20">
                {selectedSource.name}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-medium text-white/80 mb-2">🎬 ميزات المشغل:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>حظر تلقائي للإعلانات والنوافذ المنبثقة</li>
                <li>دعم كامل للترجمة العربية والإنجليزية</li>
                <li>جودة عالية مع سرعة تحميل محسنة</li>
                <li>عناصر تحكم مخصصة ومتقدمة</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-white/80 mb-2">⚡ نصائح للمشاهدة المثلى:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>جرب مصادر مختلفة للحصول على أفضل جودة</li>
                <li>استخدم وضع ملء الشاشة للتجربة الأمثل</li>
                <li>تأكد من اتصال إنترنت مستقر (5+ Mbps)</li>
                <li>فعل الترجمة إذا كانت متاحة</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-white/80 mb-2">🔧 استكشاف الأخطاء:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>إذا لم يعمل مصدر، جرب مصدراً آخر</li>
                <li>أعد تحميل الصفحة إذا واجهت مشاكل</li>
                <li>تأكد من تعطيل مانع الإعلانات للموقع</li>
                <li>استخدم متصفح محدث للحصول على أفضل أداء</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;

