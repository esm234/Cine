
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold mb-4 text-movie-primary">404</h1>
          <h2 className="text-2xl font-medium mb-6">الصفحة غير موجودة</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
          </p>
          <Button asChild className="bg-movie-primary hover:bg-movie-secondary">
            <Link to="/">العودة إلى الرئيسية</Link>
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
