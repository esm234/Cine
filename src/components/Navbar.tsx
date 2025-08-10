import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, Home, Film, Tv, Menu, X, Compass, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();

  // تعقّب التمرير لتغيير مظهر شريط التنقل
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsSearchExpanded(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    }
  };

  return (
    <>
      {/* شريط التنقل الرئيسي */}
      <header
        className={cn(
          "py-4 fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500",
          isSticky ? "bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl shadow-lg" : "bg-gradient-to-b from-background/80 to-transparent"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* الشعار */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-bold">
              <span style={{color: '#3ecfff'}}>Cine</span>
              <span style={{color: '#ffd13c'}}>Verse</span>
              <span style={{color: '#fff', fontSize: 18, marginRight: 4, marginLeft: 2}}>+</span>
            </span>
          </Link>

          {/* قائمة التنقل للشاشات الكبيرة */}
          <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse mr-4">
            <NavLink to="/">
              <Home className="w-5 h-5 ml-2" />
              <span>الرئيسية</span>
            </NavLink>
            <NavLink to="/movies">
              <Film className="w-5 h-5 ml-2" />
              <span>الأفلام</span>
            </NavLink>
            <NavLink to="/tvshows">
              <Tv className="w-5 h-5 ml-2" />
              <span>المسلسلات</span>
            </NavLink>
            <NavLink to="/explore">
              <Compass className="w-5 h-5 ml-2" />
              <span>استكشاف</span>
            </NavLink>
            <NavLink to="/favorites">
              <Heart className="w-5 h-5 ml-2" />
              <span>المفضلة</span>
            </NavLink>
          </nav>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* نموذج البحث */}
            <div className="relative">
              <AnimatePresence>
                {(isSearchExpanded || !isMobile) && (
                  <motion.form
                    onSubmit={handleSearch}
                    className="flex items-center"
                    initial={{ width: isMobile ? 0 : "auto", opacity: isMobile ? 0 : 1 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      placeholder="ابحث..."
                      className="bg-surface/30 border border-white/10 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:border-accent/50 placeholder:text-white/40 text-white backdrop-blur-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus={isSearchExpanded}
                    />
                    <button
                      type="submit"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
                      disabled={!searchQuery.trim()}
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* أيقونة البحث للموبايل */}
              {isMobile && !isSearchExpanded && (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 text-white hover:text-accent"
                  aria-label="البحث"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* قائمة المستخدم المنسدلة */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-white hover:text-accent" aria-label="قائمة المستخدم">
                  <User className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-background border-white/10 text-white">
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* زر القائمة للهاتف */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-accent"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* قائمة الموبايل */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-3 py-8">
                <MobileNavLink to="/" icon={<Home className="ml-3 w-5 h-5" />} label="الرئيسية" />
                <MobileNavLink to="/movies" icon={<Film className="ml-3 w-5 h-5" />} label="الأفلام" />
                <MobileNavLink to="/tvshows" icon={<Tv className="ml-3 w-5 h-5" />} label="المسلسلات" />
                <MobileNavLink to="/explore" icon={<Compass className="ml-3 w-5 h-5" />} label="استكشاف" />
                <MobileNavLink to="/favorites" icon={<Heart className="ml-3 w-5 h-5" />} label="المفضلة" />
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// مكون رابط التنقل للشاشات الكبيرة
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "px-4 py-2 flex items-center text-sm font-medium rounded-lg transition-all duration-300",
        isActive
          ? "bg-accent/10 text-accent"
          : "text-white/70 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </Link>
  );
};

// مكون رابط التنقل للهاتف
const MobileNavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center py-4 px-3 rounded-xl text-lg font-medium transition-all duration-300",
        isActive
          ? "bg-accent/20 text-accent"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

export default Navbar;
