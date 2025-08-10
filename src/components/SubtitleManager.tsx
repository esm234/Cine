import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subtitles, Download, Eye, EyeOff, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

interface SubtitleManagerProps {
  tmdbId: number;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  onSubtitleChange?: (subtitle: SubtitleTrack | null) => void;
}

interface SubtitleTrack {
  id: string;
  language: string;
  languageCode: string;
  label: string;
  url: string;
  format: "srt" | "vtt" | "ass";
}

// مصادر الترجمة المتاحة
const subtitleSources = [
  {
    id: "opensubtitles",
    name: "OpenSubtitles",
    getUrl: (props: SubtitleManagerProps) => {
      const { tmdbId, type = "movie", season, episode } = props;
      if (type === "movie") {
        return `https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${tmdbId}&type=movie`;
      } else {
        return `https://api.opensubtitles.com/api/v1/subtitles?tmdb_id=${tmdbId}&type=episode&season_number=${season}&episode_number=${episode}`;
      }
    }
  },
  {
    id: "subscene",
    name: "Subscene",
    getUrl: (props: SubtitleManagerProps) => {
      return `https://subscene.com/subtitles/search?q=${props.tmdbId}`;
    }
  }
];

// ترجمات افتراضية شائعة
const defaultSubtitles: SubtitleTrack[] = [
  {
    id: "ar",
    language: "العربية",
    languageCode: "ar",
    label: "Arabic",
    url: "",
    format: "srt"
  },
  {
    id: "en",
    language: "English",
    languageCode: "en", 
    label: "English",
    url: "",
    format: "srt"
  },
  {
    id: "fr",
    language: "Français",
    languageCode: "fr",
    label: "French", 
    url: "",
    format: "srt"
  }
];

const SubtitleManager = ({ tmdbId, type = "movie", season, episode, onSubtitleChange }: SubtitleManagerProps) => {
  const [availableSubtitles, setAvailableSubtitles] = useState<SubtitleTrack[]>(defaultSubtitles);
  const [selectedSubtitle, setSelectedSubtitle] = useState<SubtitleTrack | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [opacity, setOpacity] = useState([90]);
  const [position, setPosition] = useState(["bottom"]);
  const [isLoading, setIsLoading] = useState(false);

  // تحميل الترجمات المتاحة
  useEffect(() => {
    const loadSubtitles = async () => {
      setIsLoading(true);
      try {
        // محاولة تحميل الترجمات من مصادر مختلفة
        // هذا مثال - في التطبيق الحقيقي ستحتاج إلى APIs حقيقية
        const mockSubtitles: SubtitleTrack[] = [
          {
            id: "ar-auto",
            language: "العربية (تلقائية)",
            languageCode: "ar",
            label: "Arabic (Auto)",
            url: `https://example.com/subtitles/${tmdbId}/ar.srt`,
            format: "srt"
          },
          {
            id: "en-auto", 
            language: "English (Auto)",
            languageCode: "en",
            label: "English (Auto)",
            url: `https://example.com/subtitles/${tmdbId}/en.srt`,
            format: "srt"
          }
        ];
        
        setAvailableSubtitles([...defaultSubtitles, ...mockSubtitles]);
      } catch (error) {
        console.error("Failed to load subtitles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubtitles();
  }, [tmdbId, type, season, episode]);

  const handleSubtitleSelect = (subtitle: SubtitleTrack) => {
    setSelectedSubtitle(subtitle);
    setIsEnabled(true);
    onSubtitleChange?.(subtitle);
  };

  const toggleSubtitles = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    onSubtitleChange?.(newEnabled ? selectedSubtitle : null);
  };

  const downloadSubtitle = (subtitle: SubtitleTrack) => {
    // تحميل ملف الترجمة
    const link = document.createElement('a');
    link.href = subtitle.url;
    link.download = `${subtitle.language}.${subtitle.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-2">
      {/* زر تفعيل/إلغاء الترجمة */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSubtitles}
        className={`hover:bg-white/20 p-2 ${isEnabled ? 'text-blue-400' : 'text-white/70'}`}
        disabled={!selectedSubtitle}
      >
        {isEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
      </Button>

      {/* قائمة اختيار الترجمة */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-white/20 p-2 flex items-center gap-1"
          >
            <Subtitles size={18} />
            {selectedSubtitle && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs ml-1">
                {selectedSubtitle.languageCode.toUpperCase()}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 backdrop-blur-md border-white/10 min-w-[280px]">
          <div className="p-2 text-xs text-white/60 font-medium">اختر لغة الترجمة</div>
          <DropdownMenuSeparator className="bg-white/10" />
          
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-white/60">جاري تحميل الترجمات...</p>
            </div>
          ) : (
            availableSubtitles.map((subtitle) => (
              <DropdownMenuItem
                key={subtitle.id}
                onClick={() => handleSubtitleSelect(subtitle)}
                className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{subtitle.language}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-white/20">
                      {subtitle.format.toUpperCase()}
                    </Badge>
                    {subtitle.id.includes("auto") && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                        تلقائية
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {subtitle.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSubtitle(subtitle);
                      }}
                      className="p-1 hover:bg-white/20"
                    >
                      <Download size={14} />
                    </Button>
                  )}
                  {selectedSubtitle?.id === subtitle.id && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
          
          <DropdownMenuSeparator className="bg-white/10" />
          
          {/* إعدادات الترجمة */}
          <div className="p-3 space-y-3">
            <div className="text-xs text-white/60 font-medium">إعدادات الترجمة</div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">حجم الخط</span>
                <span className="text-xs text-white/50">{fontSize[0]}px</span>
              </div>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
                min={12}
                step={1}
                className="cursor-pointer"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">الشفافية</span>
                <span className="text-xs text-white/50">{opacity[0]}%</span>
              </div>
              <Slider
                value={opacity}
                onValueChange={setOpacity}
                max={100}
                min={50}
                step={5}
                className="cursor-pointer"
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* معلومات الترجمة الحالية */}
      {isEnabled && selectedSubtitle && (
        <div className="flex items-center gap-1 text-xs">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {selectedSubtitle.language}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default SubtitleManager;

