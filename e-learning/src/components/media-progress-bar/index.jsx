import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

function MediaProgressbar({ isMediaUploading, progress }) {
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

  if(!isMediaUploading) {
    return null;
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 my-5 overflow-hidden">
      <motion.div
        className="bg-blue-600 h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${animatedProgress}%`,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {progress >= 100 && isMediaUploading &&(
              <motion.div 
              className="absolut top-0 left-0 bottom-0 bg-blue-400 opacity-50"
              animate={{
                x:["0%", "100%", "0%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              />
        )}
      </motion.div>
    </div>
  );
}

export default MediaProgressbar;
