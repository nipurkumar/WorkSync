// components/LoadingDots.js
import React from "react";
import { motion } from "framer-motion";

const LoadingDots = ({ color = "text-white" }) => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 },
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <motion.div
      className="flex space-x-1"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full ${
            color === "text-white" ? "bg-white" : "bg-purple-500"
          }`}
          variants={dotVariants}
          transition={{ duration: 0.5 }}
        />
      ))}
    </motion.div>
  );
};

export default LoadingDots;
