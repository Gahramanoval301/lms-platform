import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MediaProgressBar = ({ isMediaUploading, progress }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  return (
    <div className="w-full mt-5 bg-gray-200 rounded-full h-3 mb-4 overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: `${animatedProgress}%`,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
        transition={{ duration: 0.5 }}
        className="bg-blue-600 h-3 rounded-full "
      >
        {progress >= 100 && isMediaUploading && (
          <motion.div
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-blue-400 opacity-50"
          />
        )}
      </motion.div>
    </div>
  );
};

export default MediaProgressBar;
