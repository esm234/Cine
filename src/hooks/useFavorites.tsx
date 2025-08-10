import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Movie } from "@/types/movie";

interface FavoritesContextType {
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    // استرجاع المفضلة من localStorage عند تحميل الصفحة
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        return JSON.parse(storedFavorites);
      } catch (error) {
        console.error("Error parsing favorites from localStorage", error);
        localStorage.removeItem("favorites");
        return [];
      }
    }
    return [];
  });

  // حفظ المفضلة في localStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // إضافة أو إزالة فيلم من المفضلة
  const toggleFavorite = (movie: Movie) => {
    setFavorites((currentFavorites) => {
      const isFavorite = currentFavorites.some((fav) => fav.id === movie.id);
      if (isFavorite) {
        return currentFavorites.filter((fav) => fav.id !== movie.id);
      } else {
        return [...currentFavorites, movie];
      }
    });
  };

  // التحقق مما إذا كان الفيلم مفضلاً
  const isFavorite = (id: number) => {
    return favorites.some((fav) => fav.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}; 