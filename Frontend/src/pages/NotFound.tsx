import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center p-12 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          whileHover={{ scale: 1.1, textShadow: "0 0 20px rgba(0, 0, 0, 0.1)" }}
          className="text-8xl font-bold text-blue-500 mb-6"
        >
          404
        </motion.h1>
        <p className="text-xl text-gray-600 mb-6">Oops! This page doesn’t exist in our universe.</p>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/login" className="text-blue-500 hover:text-blue-600 underline text-lg">
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;