import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-movie-dark py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4">
              <span style={{color: '#3ecfff'}}>Cine</span>
              <span style={{color: '#ffd13c'}}>Verse</span>
              <span style={{color: '#fff', fontSize: 16, marginRight: 2, marginLeft: 1}}>+</span>
            </h3>
            <p className="text-gray-400 text-sm">
              موقعك المفضل لاكتشاف أحدث الأفلام والمسلسلات والبرامج التلفزيونية.
            </p>
          </div>
          
          <div className="w-1/2 md:w-1/4">
            <h4 className="text-white font-medium mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 text-sm hover:text-movie-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-gray-400 text-sm hover:text-movie-primary transition-colors">
                  الأفلام
                </Link>
              </li>
              <li>
                <Link to="/tvshows" className="text-gray-400 text-sm hover:text-movie-primary transition-colors">
                  المسلسلات
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 text-sm hover:text-movie-primary transition-colors">
                  المفضلة
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="w-1/2 md:w-1/4">
            <h4 className="text-white font-medium mb-4">التصنيفات الرئيسية</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/genre/28" className="text-gray-400 text-sm hover:text-movie-primary transition-colors">
                  أكشن
                </Link>
              </li>
              <li>
                <Link to="/genre/18" className="text-gray-400 text-sm hover:text-movie-primary transition-colors">
                  دراما
                </Link>
              </li>
              <li>
                <Link to="/genre/35" className="text-gray-400 text-sm hover:text-movie-primary transition-colors">
                  كوميدي
                </Link>
              </li>
              <li>
                <Link to="/genre/16" className="text-gray-400 text-sm hover:text-movie-primary transition-colors">
                  أنيمي
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CineVerse+. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
