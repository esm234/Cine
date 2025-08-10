import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface VideoPlayerProps {
  tmdbId: number;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  title?: string;
}

interface VideoSource {
  url: string;
  quality: string;
  type: string;
}

const CustomVideoPlayer = ({ tmdbId, type = "movie", season, episode, title }: VideoPlayerProps) => {
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);
  const [currentSource, setCurrentSource] = useState<VideoSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // إخفاء عناصر التحكم تلقائياً
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying && !isFullscreen) {
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
  }, [showControls, isPlaying, isFullscreen]);

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

  // جلب مصادر الفيديو من vidsrc API
  const fetchVideoSources = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // محاولة جلب مصادر متعددة
      const sources = await Promise.allSettled([
        fetchFromVidsrcRip(),
        fetchFromVidsrcMe(),
        fetchFromVidsrcNet()
      ]);

      const validSources: VideoSource[] = [];
      
      sources.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          validSources.push(result.value);
        }
      });

      if (validSources.length > 0) {
        setVideoSources(validSources);
        setCurrentSource(validSources[0]);
      } else {
        setHasError(true);
        toast.error("فشل في جلب مصادر الفيديو");
      }
    } catch (error) {
      console.error('Error fetching video sources:', error);
      setHasError(true);
      toast.error("حدث خطأ أثناء جلب مصادر الفيديو");
    } finally {
      setIsLoading(false);
    }
  };

  // جلب من vidsrc.rip
  const fetchFromVidsrcRip = async (): Promise<VideoSource | null> => {
    try {
      const endpoint = type === "movie" 
        ? `https://vidsrc.rip/api/v1/movie/${tmdbId}`
        : `https://vidsrc.rip/api/v1/tv/${tmdbId}/${season || 1}/${episode || 1}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch from vidsrc.rip');
      
      const data = await response.json();
      if (data.sources && data.sources.length > 0) {
        return {
          url: data.sources[0].url,
          quality: data.sources[0].quality || "720p",
          type: "vidsrc.rip"
        };
      }
    } catch (error) {
      console.error('Error fetching from vidsrc.rip:', error);
    }
    return null;
  };

  // جلب من vidsrc.me
  const fetchFromVidsrcMe = async (): Promise<VideoSource | null> => {
    try {
      const params = type === "movie" 
        ? `tmdb=${tmdbId}`
        : `tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;

      const response = await fetch(`https://vidsrc.me/api/v1/sources?${params}`);
      if (!response.ok) throw new Error('Failed to fetch from vidsrc.me');
      
      const data = await response.json();
      if (data.sources && data.sources.length > 0) {
        return {
          url: data.sources[0].url,
          quality: data.sources[0].quality || "720p",
          type: "vidsrc.me"
        };
      }
    } catch (error) {
      console.error('Error fetching from vidsrc.me:', error);
    }
    return null;
  };

  // جلب من vidsrc.net
  const fetchFromVidsrcNet = async (): Promise<VideoSource | null> => {
    try {
      const params = type === "movie" 
        ? `tmdb=${tmdbId}`
        : `tmdb=${tmdbId}&season=${season || 1}&episode=${episode || 1}`;

      const response = await fetch(`https://vidsrc.net/api/v1/sources?${params}`);
      if (!response.ok) throw new Error('Failed to fetch from vidsrc.net');
      
      const data = await response.json();
      if (data.sources && data.sources.length > 0) {
        return {
          url: data.sources[0].url,
          quality: data.sources[0].quality || "720p",
          type: "vidsrc.net"
        };
      }
    } catch (error) {
      console.error('Error fetching from vidsrc.net:', error);
    }
    return null;
  };

  // تحميل مصادر الفيديو عند التحميل
  useEffect(() => {
    fetchVideoSources();
  }, [tmdbId, type, season, episode]);

  // تحديث معلومات الفيديو
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setBuffering(true);
    const handleCanPlay = () => setBuffering(false);
    const handleError = () => {
      setHasError(true);
      setBuffering(false);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [currentSource]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value[0] / 100;
    setVolume(value);
    setIsMuted(value[0] === 0);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    fetchVideoSources();
  };

  const switchSource = (source: VideoSource) => {
    setCurrentSource(source);
    setHasError(false);
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-white text-lg">جاري تحميل الفيديو...</p>
          <p className="text-white/60 text-sm">يتم جلب أفضل مصادر المشاهدة</p>
        </div>
      </div>
    );
  }

  if (hasError || !currentSource) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
        <Alert className="bg-red-500/10 border-red-500/20 max-w-md">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            فشل في تحميل الفيديو. تأكد من اتصالك بالإنترنت.
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
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* اختيار المصدر */}
      {videoSources.length > 1 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {videoSources.map((source, index) => (
            <Button
              key={index}
              variant={currentSource === source ? "default" : "outline"}
              size="sm"
              onClick={() => switchSource(source)}
              className="text-xs"
            >
              {source.type} - {source.quality}
            </Button>
          ))}
        </div>
      )}

      {/* مشغل الفيديو */}
      <div
        ref={playerRef}
        className="w-full aspect-video bg-black rounded-lg overflow-hidden relative group"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => !isFullscreen && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={currentSource.url}
          className="w-full h-full object-contain"
          onClick={togglePlayPause}
          crossOrigin="anonymous"
        />

        {/* شاشة التحميل */}
        {buffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}

        {/* عناصر التحكم */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* زر التشغيل المركزي */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlayPause}
              className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </Button>
          </div>

          {/* شريط التحكم السفلي */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* شريط التقدم */}
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />

            {/* أزرار التحكم */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>

                <div className="w-20">
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;