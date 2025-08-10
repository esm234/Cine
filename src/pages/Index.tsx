import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./HomePage";
import MoviesPage from "./MoviesPage";
import TvShowsPage from "./TvShowsPage";
import MovieDetailsPage from "./MovieDetailsPage";
import TvShowDetailsPage from "./TvShowDetailsPage";
import SearchPage from "./SearchPage";
import GenrePage from "./GenrePage";
import FavoritesPage from "./FavoritesPage";
import NotFound from "./NotFound";
import TopRatedMoviesPage from "./TopRatedMoviesPage";
import TopRatedTvShowsPage from "./TopRatedTvShowsPage";
import AsianMoviesPage from "./AsianMoviesPage";
import AsianTvShowsPage from "./AsianTvShowsPage";
import OscarMoviesPage from "./OscarMoviesPage";
import PersonDetailsPage from "./PersonDetailsPage";
import ExplorePage from "./ExplorePage";
import PersonMoviesPage from "./PersonMoviesPage";
import PersonTvShowsPage from "./PersonTvShowsPage";
import MovieWatchPage from "./MovieWatchPage";
import LandingPage from "./LandingPage";
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ActivatePage from './ActivatePage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

// مكون يقوم بتمرير المستخدم إلى أعلى الصفحة عند تغيير المسار
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* صفحات عامة */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/activate" element={<ActivatePage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* صفحات محمية */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/movies" element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
          <Route path="/tvshows" element={<ProtectedRoute><TvShowsPage /></ProtectedRoute>} />
          <Route path="/movie/:id" element={<ProtectedRoute><MovieDetailsPage /></ProtectedRoute>} />
          <Route path="/tv/:id" element={<ProtectedRoute><TvShowDetailsPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/genre/:id" element={<ProtectedRoute><GenrePage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/movies/top-rated" element={<ProtectedRoute><TopRatedMoviesPage /></ProtectedRoute>} />
          <Route path="/tvshows/top-rated" element={<ProtectedRoute><TopRatedTvShowsPage /></ProtectedRoute>} />
          <Route path="/movies/asian" element={<ProtectedRoute><AsianMoviesPage /></ProtectedRoute>} />
          <Route path="/tvshows/asian" element={<ProtectedRoute><AsianTvShowsPage /></ProtectedRoute>} />
          <Route path="/movies/oscar" element={<ProtectedRoute><OscarMoviesPage /></ProtectedRoute>} />
          <Route path="/person/:id" element={<ProtectedRoute><PersonDetailsPage /></ProtectedRoute>} />
          <Route path="/person/:id/movies" element={<ProtectedRoute><PersonMoviesPage /></ProtectedRoute>} />
          <Route path="/person/:id/tvshows" element={<ProtectedRoute><PersonTvShowsPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/watch/:id" element={<ProtectedRoute><MovieWatchPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
