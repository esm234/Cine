import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchTrending, getImageUrl } from "@/services/api";
import { Movie } from "@/types/movie";
import { Check, Crown, Star, Zap, ArrowRight, Play, Heart, PlusCircle, LogIn, UserPlus, Tv, PauseCircle, Shield, Download, DollarSign, Smile } from "lucide-react";

// مكون بطاقة الميزة
interface FeatureCardProps {
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  shadowColor: string;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

const FeatureCard = ({ icon, color, hoverColor, shadowColor, title, description, gradient, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className={`group p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 text-white shadow-2xl border border-gray-700/50 ${hoverColor} transition-all duration-500 hover:scale-105 backdrop-blur-sm`}
    >
      <div className={`bg-gradient-to-br ${color} mb-6 flex items-center justify-center rounded-2xl w-16 h-16 shadow-lg ${shadowColor} transition-all duration-300`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-bold mb-3 text-xl bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-transparent to-transparent hover:from-primary/5 hover:to-transparent rounded-3xl transition-all duration-500 -z-10"></div>
    </motion.div>
  );
};

// مكون بطاقة خطة الاشتراك
interface PriceCardProps {
  months: number;
  price: number;
  selected: boolean;
  index: number;
}

const PriceCard = ({ months, price, selected, index }: PriceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        boxShadow: selected 
          ? "0 25px 50px -12px rgba(250, 204, 21, 0.25)" 
          : "0 25px 50px -12px rgba(8, 145, 178, 0.25)",
        transition: { duration: 0.3 }
      }}
      className={`relative overflow-hidden rounded-2xl p-8 min-w-[250px] text-center border-2 transition-all duration-300 shadow-xl ${
        selected 
          ? "bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-400 text-black scale-105 shadow-yellow-400/20" 
          : "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 text-white hover:border-cyan-500/30"
      }`}
    >
      {selected && (
        <motion.div 
          className="absolute top-0 left-0 w-full text-xs bg-yellow-400 text-black py-1 font-bold"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          الأكثر شعبية
        </motion.div>
      )}
      
      <div className="mt-2">
        <div className={`text-lg font-bold mb-2 ${selected ? "text-gray-800" : "text-gray-100"}`}>
          خطة الـ {months} شهر
        </div>
        
        <div className="flex items-center justify-center gap-1 mb-4">
          <span className={`text-3xl font-extrabold ${selected ? "text-gray-900" : "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"}`}>
            {price}
          </span>
          <span className={`text-lg ${selected ? "text-gray-700" : "text-gray-400"}`}>ريال</span>
        </div>
        
        <div className={`text-xs mb-6 ${selected ? "text-gray-700" : "text-gray-400"}`}>
          لمدة {months * 30} يوم
        </div>
        
        <ul className={`text-sm mb-6 space-y-2 ${selected ? "text-gray-700" : "text-gray-300"}`}>
          <motion.li 
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Check size={16} className={selected ? "text-green-600" : "text-green-500"} />
            <span>مشاهدة بدون إعلانات</span>
          </motion.li>
          <motion.li 
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Check size={16} className={selected ? "text-green-600" : "text-green-500"} />
            <span>جودة عرض عالية الدقة</span>
          </motion.li>
          <motion.li 
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <Check size={16} className={selected ? "text-green-600" : "text-green-500"} />
            <span>دعم فني على مدار الساعة</span>
          </motion.li>
        </ul>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className={`w-full ${
              selected 
                ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-600 hover:to-yellow-500" 
                : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700"
            } font-bold rounded-xl px-6 py-2.5 transition-all duration-300 shadow-lg`}
          >
            اشترك الآن
          </Button>
        </motion.div>
      </div>
      
      {/* تأثير الضوء الخلفي */}
      {selected && (
        <motion.div 
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full filter blur-[80px] -z-10"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}
      
      {/* تأثير الحدود المضيئة للبطاقة المختارة */}
      {selected && (
        <motion.div 
          className="absolute inset-0 rounded-2xl border-2 border-yellow-400/50 -z-5"
          animate={{ 
            boxShadow: [
              "0 0 10px 0px rgba(250, 204, 21, 0.3)", 
              "0 0 20px 0px rgba(250, 204, 21, 0.5)", 
              "0 0 10px 0px rgba(250, 204, 21, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

const LandingPage = () => {
  // الحصول على الأفلام الرائجة لعرضها في القسم الرئيسي
  const { data: trendingMovies } = useQuery({
    queryKey: ["trending", "movie", "week"],
    queryFn: () => fetchTrending("movie", "week"),
  });

  const featuredMovies = trendingMovies?.results?.slice(0, 6) || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const features = [
    {
      icon: "tv",
      color: "bg-blue-600",
      title: "تجربة مشاهدة مميزة",
      desc: "لا تسع رحلتك، وتمتع بمزايا تخطي المقدمة والانتقال التلقائي بين الحلقات واستكمال المشاهدة حيث توقفت."
    },
    {
      icon: "pause",
      color: "bg-yellow-500",
      title: "مشاهدة بدون توقف",
      desc: "نكمل تجربتك، نقدم لكم عدم إزعاجكم بالإعلانات، وكذلك التعويض في حال انقطاع الاتصال."
    },
    {
      icon: "shield",
      color: "bg-red-600",
      title: "خصوصيتك أولوية",
      desc: "نقدم لك 5 ملفات مع كل اشتراك للتمكن من مشاركتها مع العائلة والأصدقاء."
    },
    {
      icon: "download",
      color: "bg-green-600",
      title: "حمل الآن وشاهد لاحقاً",
      desc: "يمكنك تنزيل عروضك المفضلة مع خاصية اختيار الجودة المناسبة لك."
    },
    {
      icon: "dollar-sign",
      color: "bg-orange-500",
      title: "سعر أقل",
      desc: "نكمل رحلتك نقدم لك أسعار مناسبة لباقاتنا وفي متناول الجميع."
    },
    {
      icon: "smile",
      color: "bg-cyan-500",
      title: "دع أطفالك يشاركونك الترفيه",
      desc: "سيعيش أطفالك عالم من المرح مع شخصياتهم الكرتونية المفضلة."
    },
  ];

  const plans = [
    { months: 12, price: 125, selected: true },
    { months: 6, price: 80, selected: false },
    { months: 3, price: 50, selected: false },
    { months: 1, price: 20, selected: false },
  ];

  const iconMap = {
    tv: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M8 3h8M12 3v4"/></svg>,
    pause: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>,
    shield: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    download: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v12m0 0l4-4m-4 4l-4-4"/><rect x="4" y="17" width="16" height="4" rx="2"/></svg>,
    "dollar-sign": <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    smile: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>,
  };

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden" style={{ fontFamily: "'Noto Sans Arabic', 'Roboto'" }}>
      {/* Hero */}
      <section className="relative z-10 min-h-[700px] flex flex-col items-center justify-start pb-0">
        {/* خلفية الهيرو البنفسجية */}
        <img src="https://www.faselplus.com/wp-content/themes/Faselplus/Assets/imgs/background/welcome_bg.png" alt="hero-bg" className="absolute inset-0 w-full h-full object-cover object-top z-0" style={{minHeight:'700px'}} />
        
        {/* تأثيرات الضوء والخلفية */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95 z-10" style={{minHeight:'700px'}} />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] opacity-5 z-10"></div>
        
        {/* تأثيرات الضوء المتحركة */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-[100px] z-10"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[100px] z-10"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Navbar فوق الخلفية */}
        <header className="flex items-center justify-between w-full px-5 pt-4 pb-2 relative z-20" style={{maxWidth: 1400, margin: '0 auto'}}>
          <motion.div 
            className="flex items-center" 
            style={{maxWidth: 160, fontWeight: 900, fontSize: 32, letterSpacing: 1, fontFamily: 'Noto Sans Arabic, Roboto'}}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{color: '#3ecfff'}}>Cine</span><span style={{color: '#ffd13c'}}>Verse</span><span style={{color: '#fff', fontSize: 18, marginRight: 4, marginLeft: 2}}>+</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/login">
              <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-medium rounded-full px-6 py-2 hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25">
                <LogIn className="w-4 h-4 ml-2" />
                تسجيل الدخول
              </Button>
            </Link>
          </motion.div>
        </header>
        
        {/* محتوى الهيرو */}
        <div className="flex flex-col items-center justify-center w-full relative z-20 px-4" style={{marginTop: 60}}>
          <motion.h1 
            className="text-center text-white mb-8" 
            style={{fontSize: 38, fontWeight: 600, lineHeight: '60px'}}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            استكشف عالماً من الترفيه مع <span style={{color:'#3ecfff'}}>Cine</span><span style={{color:'#ffd13c'}}>Verse</span><span style={{color:'#fff', fontSize: 28, marginRight: 4, marginLeft: 2}}>+</span>
          </motion.h1>
          
          <motion.p 
            className="text-white text-center mb-8 max-w-2xl mx-auto" 
            style={{fontSize: 17, lineHeight: '26px', fontWeight: 400}}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            منصتك العربية الأولى لمشاهدة أحدث الأفلام والمسلسلات بجودة عالية وبدون إعلانات، مع مكتبة ضخمة تناسب جميع الأذواق والأعمار.
          </motion.p>
          
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold rounded-full px-8 py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-1">
              اشترك الآن واستمتع بكل المميزات
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <div className="relative">
              {/* تأثير الضوء خلف الشاشة */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full filter blur-[80px] transform scale-110"></div>
              
              <img 
                src="https://www.faselplus.com/wp-content/themes/Faselplus/Assets/imgs/background/tv_img.png" 
                alt="tv" 
                className="max-w-full h-auto relative z-10 drop-shadow-2xl" 
              />
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features */}
      <section className="py-20 px-4 relative">
        {/* خلفية متدرجة للقسم مع تأثير الضوء */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-[120px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* عنوان القسم */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h5 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">مميزات</h5>
            <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent" style={{letterSpacing: 2}}>CineVerse+</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-cyan-400 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">اكتشف عالمًا من المزايا الحصرية التي تجعل تجربة المشاهدة لديك استثنائية</p>
          </motion.div>
          
          {/* شبكة المميزات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Tv size={28} />}
              color="from-blue-500 to-blue-600"
              hoverColor="hover:border-blue-500/50"
              shadowColor="group-hover:shadow-blue-500/25"
              title="تجربة مشاهدة سينمائية"
              description="استمتع بأحدث الأفلام والمسلسلات بجودة عالية وصوت محيطي، وكأنك في السينما."
              gradient="from-blue-400 to-cyan-400"
              delay={0.1}
            />
            
            <FeatureCard 
              icon={<PauseCircle size={28} />}
              color="from-yellow-500 to-orange-500"
              hoverColor="hover:border-yellow-500/50"
              shadowColor="group-hover:shadow-yellow-500/25"
              title="بدون إعلانات"
              description="شاهد كل ما تحب بدون أي إزعاج أو فواصل إعلانية، استمتع بتجربة نقية بالكامل."
              gradient="from-yellow-400 to-orange-400"
              delay={0.2}
            />
            
            <FeatureCard 
              icon={<Download size={28} />}
              color="from-green-500 to-emerald-600"
              hoverColor="hover:border-green-500/50"
              shadowColor="group-hover:shadow-green-500/25"
              title="حمل وشاهد لاحقاً"
              description="يمكنك تنزيل عروضك المفضلة ومشاهدتها في أي وقت بدون إنترنت."
              gradient="from-green-400 to-emerald-400"
              delay={0.3}
            />
            
            <FeatureCard 
              icon={<Shield size={28} />}
              color="from-red-500 to-pink-600"
              hoverColor="hover:border-red-500/50"
              shadowColor="group-hover:shadow-red-500/25"
              title="خصوصية وأمان"
              description="حسابك محمي بالكامل، ويمكنك مشاركة اشتراكك مع العائلة بأمان."
              gradient="from-red-400 to-pink-400"
              delay={0.4}
            />
            
            <FeatureCard 
              icon={<Smile size={28} />}
              color="from-cyan-500 to-blue-500"
              hoverColor="hover:border-cyan-500/50"
              shadowColor="group-hover:shadow-cyan-500/25"
              title="مناسب لكل العائلة"
              description="محتوى متنوع وآمن للأطفال والكبار، مع تصنيفات تناسب الجميع."
              gradient="from-cyan-400 to-blue-400"
              delay={0.5}
            />
            
            <FeatureCard 
              icon={<DollarSign size={28} />}
              color="from-orange-500 to-red-500"
              hoverColor="hover:border-orange-500/50"
              shadowColor="group-hover:shadow-orange-500/25"
              title="سعر في متناول الجميع"
              description="خطط اشتراك مرنة وأسعار تناسب كل الفئات."
              gradient="from-orange-400 to-red-400"
              delay={0.6}
            />
          </div>
          
          {/* زر الاشتراك */}
          <motion.div 
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold rounded-full px-8 py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-1">
              اشترك الآن واستمتع بكل المميزات
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      {/* Plans */}
      <section className="py-20 px-4 relative">
        {/* خلفية متدرجة للقسم */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/10 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] opacity-5"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full filter blur-[120px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* عنوان القسم */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h5 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">خطط الاشتراك</h5>
            <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent" style={{letterSpacing: 2}}>اختر الباقة المناسبة</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-400 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">باقات متنوعة بأسعار تناسب الجميع، اختر الخطة المناسبة واستمتع بتجربة مشاهدة فريدة</p>
          </motion.div>
          
          {/* كروت الأسعار */}
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <PriceCard 
                key={i}
                months={plan.months}
                price={plan.price}
                selected={plan.selected}
                index={i}
              />
            ))}
          </div>
          
          <motion.p 
            className="text-center text-gray-400 text-sm mt-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            جميع الباقات تشمل الوصول لكامل محتوى المنصة بدون قيود. يمكنك إلغاء الاشتراك في أي وقت.
          </motion.p>
        </div>
      </section>
      {/* App Section */}
      <section className="py-24 px-4 relative">
        {/* خلفية متدرجة للقسم */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-green-500/10 rounded-full filter blur-[120px]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              className="md:w-1/2 text-center md:text-right order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h5 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">تطبيق الجوال</h5>
              <h3 className="text-3xl font-black mb-6 text-white">شاهد من أي مكان وفي أي وقت</h3>
              
              <ul className="space-y-4 mb-8 max-w-md mx-auto md:mr-0 md:ml-auto">
                <li className="flex items-center gap-3 text-gray-200">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 shrink-0">
                    <Check size={18} className="text-white" />
                  </div>
                  <span>تحميل المحتوى لمشاهدته لاحقاً بدون إنترنت</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 shrink-0">
                    <Check size={18} className="text-white" />
                  </div>
                  <span>إشعارات فورية بوصول محتوى جديد</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 shrink-0">
                    <Check size={18} className="text-white" />
                  </div>
                  <span>تجربة مشاهدة سلسة ومتوافقة مع جميع الأجهزة</span>
                </li>
              </ul>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                <a href="#" target="_blank" rel="noopener noreferrer" className="transform transition-transform hover:scale-105">
                  <img src="https://www.faselplus.com/wp-content/themes/Faselplus/Assets/imgs/icons/google_play.png" alt="Google Play" className="h-14" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="transform transition-transform hover:scale-105">
                  <img src="https://www.faselplus.com/wp-content/themes/Faselplus/Assets/imgs/icons/app_store.png" alt="App Store" className="h-14" />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 relative order-1 md:order-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* الهالة الخلفية */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full filter blur-[80px] transform scale-110"></div>
                
                {/* صورة التطبيق */}
                <img 
                  src="https://www.faselplus.com/wp-content/themes/Faselplus/Assets/imgs/background/app_img.png" 
                  alt="تطبيق CineVerse+" 
                  className="relative z-10 w-72 mx-auto drop-shadow-2xl"
                />
                
                {/* الدائرة المتحركة */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-green-500/30 animate-[spin_10s_linear_infinite] -z-10"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-cyan-500/20 animate-[spin_15s_linear_infinite_reverse] -z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-[#23232a] py-6 mt-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
        <div className="flex gap-4 justify-center mb-2">
          <a href="#" className="hover:text-white"><i className="fab fa-telegram-plane"></i></a>
          <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i></a>
          <a href="#" className="hover:text-white"><i className="fab fa-facebook"></i></a>
          <a href="#" className="hover:text-white"><i className="fab fa-instagram"></i></a>
        </div>
        <div>
          كافة الحقوق محفوظة. CineVerse 2025© | الأسئلة الشائعة | اتصل بنا | سياسة الخصوصية
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
