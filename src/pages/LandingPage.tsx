import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionTemplate, 
  useMotionValue 
} from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchTrending, getImageUrl } from "@/services/api"; // Assuming these exist
import { 
  Check, Crown, Zap, ArrowRight, Play, Heart, 
  Tv, Shield, Download, Smartphone, 
  MonitorPlay, Cast, X, Star, Menu
} from "lucide-react";

// --- Utility Components ---

// 1. Background Aurora Effect
const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.3, 0.5, 0.3], 
          rotate: [0, 90, 0] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/30 blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1], 
          opacity: [0.2, 0.4, 0.2],
          x: [0, 100, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[120px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[60vw] rounded-full bg-indigo-900/20 blur-[100px]" 
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
};

// 2. Spotlight Card (Interactive Hover)
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-white/10 bg-gray-900/40 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(124, 58, 237, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

// 3. Infinite Marquee for Movies
const MovieMarquee = ({ movies, direction = "left" }: { movies: any[], direction?: "left" | "right" }) => {
  return (
    <div className="flex overflow-hidden w-full relative z-10 py-8 group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-20" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-20" />
        
        <motion.div 
          className="flex gap-6 flex-nowrap"
          animate={{ x: direction === "left" ? "-50%" : "0%" }}
          initial={{ x: direction === "left" ? "0%" : "-50%" }}
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
        >
            {[...movies, ...movies, ...movies].map((movie, idx) => (
                <div key={`${movie.id}-${idx}`} className="relative w-[180px] h-[270px] rounded-xl overflow-hidden shrink-0 border border-white/10 hover:scale-110 hover:z-30 transition-all duration-300 cursor-pointer shadow-lg shadow-black/50">
                    <img 
                        src={getImageUrl(movie.poster_path)} 
                        alt={movie.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 right-3 left-3 text-right">
                        <p className="text-white text-xs font-bold truncate">{movie.title || movie.name}</p>
                        <div className="flex items-center gap-1 text-yellow-400 text-[10px] mt-1">
                            <Star size={10} fill="currentColor" />
                            <span>{movie.vote_average?.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
  );
};

// --- Main Page Components ---

const LandingPage = () => {
  const { data: trendingMovies } = useQuery({
    queryKey: ["trending", "movie", "week"],
    queryFn: () => fetchTrending("movie", "week"),
  });
  
  const moviesList = trendingMovies?.results || [];
  const row1 = moviesList.slice(0, 10);
  const row2 = moviesList.slice(10, 20);

  // Smooth Scroll Physics
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white font-['Cairo'] relative overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Global Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 origin-left z-50" style={{ scaleX }} />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Play className="text-white fill-white ml-1" size={20} />
                </div>
                <span className="text-2xl font-black tracking-tighter">
                    Cine<span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 to-cyan-400">Verse</span>+
                </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <a href="#" className="hover:text-white transition-colors">الرئيسية</a>
                <a href="#" className="hover:text-white transition-colors">المسلسلات</a>
                <a href="#" className="hover:text-white transition-colors">الأفلام</a>
                <a href="#" className="hover:text-white transition-colors">الأكثر شهرة</a>
            </div>

            <Link to="/login">
                <Button className="bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all rounded-full font-bold px-6">
                    تسجيل الدخول
                </Button>
            </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <AuroraBackground />
        
        {/* Abstract Geometric Shapes */}
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-right"
            >
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
                >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-green-400">المنصة رقم #1 في الشرق الأوسط</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
                    السينما <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">بين يديك.</span>
                </h1>
                
                <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
                    آلاف الأفلام والمسلسلات الحصرية بجودة 4K الخيالية. بدون إعلانات، بدون تقطيع، وبترجمة احترافية تناسب ذائقتك.
                </p>

                <div className="flex flex-wrap gap-4">
                    <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-bold shadow-xl shadow-purple-900/30 hover:shadow-purple-900/50 transition-all hover:-translate-y-1">
                        ابدأ فترتك المجانية
                        <Zap className="mr-2 w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm text-lg">
                        تصفح المكتبة
                    </Button>
                </div>

                <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex -space-x-3 space-x-reverse">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <p>انضم لأكثر من <span className="text-white font-bold">+2 مليون</span> مشترك سعيد</p>
                </div>
            </motion.div>

            {/* Hero Visual - 3D Card Effect */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative hidden lg:block"
            >
                <div className="relative z-20 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20 bg-gray-900 aspect-video">
                    <img 
                        src="https://image.tmdb.org/t/p/original/zfbjgQE1uW9uRuPHueTsWHt522p.jpg" // Example Landscape
                        className="w-full h-full object-cover opacity-60"
                        alt="Hero Movie"
                    />
                    {/* UI Overlay Mockup */}
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <h3 className="text-3xl font-bold mb-2">The Killer</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-1 bg-red-600 rounded text-xs font-bold">TOP 10</span>
                            <span className="text-green-400 font-bold">98% Match</span>
                            <span className="text-gray-300">2024</span>
                            <span className="border border-gray-500 rounded px-1 text-xs text-gray-300">4K HDR</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full w-full overflow-hidden">
                            <div className="h-full bg-red-600 w-1/3"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>متبقي 45 دقيقة</span>
                        </div>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border border-white/30">
                        <Play fill="white" className="w-8 h-8 ml-1" />
                    </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -right-10 z-30 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl flex items-center gap-3"
                >
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                        <Download size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">تم التحميل</p>
                        <p className="font-bold text-sm">Inception</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* --- TRENDING SCROLL --- */}
      <section className="py-10 bg-black relative z-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold mb-2">الأكثر مشاهدة اليوم 🔥</h2>
                <p className="text-gray-400 text-sm">اختيارات الجمهور للأفلام والمسلسلات</p>
            </div>
            <Button variant="link" className="text-purple-400 hover:text-purple-300">عرض الكل</Button>
        </div>
        <div className="flex flex-col gap-8">
            {moviesList.length > 0 && (
                <>
                   <MovieMarquee movies={row1} direction="left" />
                </>
            )}
        </div>
      </section>

      {/* --- FEATURES GRID (Bento Style) --- */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
                <span className="text-purple-500 font-bold tracking-wider uppercase text-sm">لماذا نحن؟</span>
                <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6">تجربة تفوق التوقعات</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">صممنا CineVerse+ لتعالج كل مشاكل المشاهدة التقليدية. استمتع بالحرية الكاملة.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <SpotlightCard className="md:col-span-2 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-right">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                            <MonitorPlay size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">جودة 4K Ultra HD</h3>
                        <p className="text-gray-400 leading-relaxed">
                            شاهد التفاصيل كما لم ترها من قبل. ندعم تقنيات Dolby Vision و Dolby Atmos لتجربة سينمائية منزلية متكاملة تأسر حواسك.
                        </p>
                    </div>
                    <div className="flex-1 relative h-48 w-full bg-gradient-to-br from-gray-800 to-black rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/1193428627/vector/4k-ultra-hd-format-icon-isolated-on-transparent-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=C6aP-hWjSByXGeR3B9OQzZp5O_5JqLgX_zXq_q_q_q_q')] opacity-20 bg-cover"></div>
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">4K HDR</span>
                    </div>
                </SpotlightCard>

                {/* Feature 2 */}
                <SpotlightCard className="rounded-3xl p-8">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-6">
                        <Zap size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">بدون إعلانات إطلاقاً</h3>
                    <p className="text-gray-400 text-sm">
                        لا مقاطعات، لا نوافذ منبثقة. ركز في القصة فقط. نحن نحترم وقتك واندماجك مع المحتوى.
                    </p>
                </SpotlightCard>

                {/* Feature 3 */}
                <SpotlightCard className="rounded-3xl p-8">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6">
                        <Download size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">تحميل للمشاهدة أوفلاين</h3>
                    <p className="text-gray-400 text-sm">
                        مسافر؟ الإنترنت ضعيف؟ حمل مواسم كاملة وشاهدها في أي وقت وأي مكان.
                    </p>
                </SpotlightCard>

                {/* Feature 4 */}
                <SpotlightCard className="md:col-span-2 rounded-3xl p-8 flex flex-col-reverse md:flex-row items-center gap-8">
                     <div className="flex-1 flex gap-4 justify-center">
                        <div className="w-24 h-32 rounded-lg bg-gray-800 border border-white/10 shadow-lg transform -rotate-6"></div>
                        <div className="w-24 h-32 rounded-lg bg-gray-700 border border-white/10 shadow-lg transform translate-y-4 z-10"></div>
                        <div className="w-24 h-32 rounded-lg bg-gray-800 border border-white/10 shadow-lg transform rotate-6"></div>
                     </div>
                    <div className="flex-1 text-right">
                        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">محتوى عائلي آمن</h3>
                        <p className="text-gray-400 leading-relaxed">
                            خصص ملفات شخصية لأطفالك مع أدوات رقابة أبوية قوية. كن مطمئناً لما يشاهدونه.
                        </p>
                    </div>
                </SpotlightCard>
            </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4">اختر خطتك</h2>
                <p className="text-gray-400">إلغاء في أي وقت. بدون عقود ملزمة.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                {/* Basic Plan */}
                <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <h3 className="text-xl font-bold text-gray-300 mb-2">شهرية</h3>
                    <div className="text-3xl font-bold mb-6">20 <span className="text-sm text-gray-500 font-normal">ريال / شهر</span></div>
                    <ul className="space-y-4 text-sm text-gray-400 mb-8">
                        <li className="flex gap-2"><Check size={18} className="text-gray-600" /> جودة جيدة (720p)</li>
                        <li className="flex gap-2"><Check size={18} className="text-gray-600" /> جهاز واحد في نفس الوقت</li>
                        <li className="flex gap-2"><Check size={18} className="text-gray-600" /> إعلانات محدودة</li>
                    </ul>
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-6">اختيار</Button>
                </div>

                {/* Premium Plan (Highlighted) */}
                <div className="relative p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-black shadow-2xl shadow-purple-900/20 transform md:scale-110 z-10">
                    <div className="absolute -top-4 right-0 left-0 flex justify-center">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                            الأكثر طلباً
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        سنوية <Crown size={18} className="text-yellow-400" />
                    </h3>
                    <div className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        125 <span className="text-sm text-gray-500 font-normal">ريال / سنة</span>
                    </div>
                    <p className="text-green-400 text-xs font-bold mb-6 bg-green-400/10 inline-block px-2 py-1 rounded">وفر 45% مقارنة بالشهري</p>
                    
                    <ul className="space-y-4 text-sm text-gray-300 mb-8">
                        <li className="flex gap-2"><Check size={18} className="text-purple-400" /> أعلى جودة (4K HDR)</li>
                        <li className="flex gap-2"><Check size={18} className="text-purple-400" /> 4 أجهزة في نفس الوقت</li>
                        <li className="flex gap-2"><Check size={18} className="text-purple-400" /> بدون إعلانات نهائياً</li>
                        <li className="flex gap-2"><Check size={18} className="text-purple-400" /> صوت محيطي (Spatial Audio)</li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl py-6 shadow-lg shadow-purple-500/25">
                        اشترك الآن
                    </Button>
                </div>

                {/* Standard Plan */}
                <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <h3 className="text-xl font-bold text-gray-300 mb-2">ربع سنوية</h3>
                    <div className="text-3xl font-bold mb-6">50 <span className="text-sm text-gray-500 font-normal">ريال / 3 شهور</span></div>
                    <ul className="space-y-4 text-sm text-gray-400 mb-8">
                        <li className="flex gap-2"><Check size={18} className="text-white" /> جودة عالية (1080p)</li>
                        <li className="flex gap-2"><Check size={18} className="text-white" /> جهازين في نفس الوقت</li>
                        <li className="flex gap-2"><Check size={18} className="text-white" /> بدون إعلانات</li>
                    </ul>
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-6">اختيار</Button>
                </div>
            </div>
        </div>
      </section>

      {/* --- APP DOWNLOAD (Glass Mockup) --- */}
      <section className="py-20 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2 text-right">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">حمل التطبيق الآن</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        مكتبتك المفضلة في جيبك. استمتع بمشاهدة سلسة أثناء التنقل، مع خاصية التحميل الذكي التي توفر بياناتك.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-white text-black px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform font-bold">
                            <span className="text-2xl">🍎</span>
                            <div className="text-left">
                                <div className="text-[10px] uppercase">Download on the</div>
                                <div className="leading-none">App Store</div>
                            </div>
                        </button>
                        <button className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-white/5 hover:scale-105 transition-transform font-bold">
                            <span className="text-2xl">🤖</span>
                            <div className="text-left">
                                <div className="text-[10px] uppercase">Get it on</div>
                                <div className="leading-none">Google Play</div>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center relative">
                     <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                     >
                        <Smartphone size={300} strokeWidth={0.5} className="text-gray-800 fill-black/50 drop-shadow-2xl" />
                        {/* Mockup Screen Content */}
                        <div className="absolute top-[15px] left-[18px] w-[265px] h-[560px] bg-gray-900 rounded-[2rem] overflow-hidden">
                             <img src="https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg" className="w-full h-full object-cover opacity-80" alt="App Screen" />
                             <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-6">
                                <div className="text-2xl font-bold">Fast X</div>
                                <button className="mt-4 w-full bg-white text-black py-3 rounded-full font-bold text-sm">مشاهدة الآن</button>
                             </div>
                        </div>
                     </motion.div>
                </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black pt-16 pb-8 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
                <div className="text-white text-2xl font-black mb-6">CineVerse+</div>
                <p className="mb-4">وجهتك الأولى للترفيه العربي والعالمي.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-purple-400 transition-colors">حسابي</a></li>
                    <li><a href="#" className="hover:text-purple-400 transition-colors">مركز المساعدة</a></li>
                    <li><a href="#" className="hover:text-purple-400 transition-colors">الأجهزة المدعومة</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">قانوني</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-purple-400 transition-colors">الشروط والأحكام</a></li>
                    <li><a href="#" className="hover:text-purple-400 transition-colors">الخصوصية</a></li>
                    <li><a href="#" className="hover:text-purple-400 transition-colors">سياسة الكوكيز</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all cursor-pointer"><Tv size={18}/></div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all cursor-pointer"><Heart size={18}/></div>
                </div>
            </div>
        </div>
        <div className="text-center pt-8 border-t border-white/5">
            &copy; 2025 CineVerse Inc. صنع بحب للمشاهد العربي.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
