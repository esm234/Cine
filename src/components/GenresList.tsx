
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Genre } from "@/types/movie";

interface GenresListProps {
  genres: Genre[];
  title?: string;
  type?: "movie" | "tv";
}

const GenresList = ({ genres, title = "التصنيفات", type = "movie" }: GenresListProps) => {
  return (
    <section className="mb-12">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h2>
      
      <motion.div 
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {genres.map((genre, index) => (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.05,
              type: "spring",
              stiffness: 100 
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to={`/genre/${genre.id}?type=${type}`} 
              className="category-pill block"
            >
              {genre.name}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default GenresList;
