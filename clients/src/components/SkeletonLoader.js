// components/SkeletonLoader.js
import React from "react";
import { motion } from "framer-motion";

const SkeletonLoader = ({
  type = "card",
  count = 1,
  className = "",
  animated = true,
}) => {
  const skeletonVariants = {
    loading: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const CardSkeleton = () => (
    <motion.div
      className={`bg-white/10 rounded-2xl p-6 space-y-4 ${className}`}
      variants={animated ? skeletonVariants : {}}
      animate={animated ? "loading" : ""}
    >
      <div className="flex items-center justify-between">
        <div className="h-6 bg-white/20 rounded w-3/4"></div>
        <div className="h-8 bg-white/20 rounded w-20"></div>
      </div>
      <div className="h-4 bg-white/20 rounded w-full"></div>
      <div className="h-4 bg-white/20 rounded w-2/3"></div>
      <div className="flex space-x-2">
        <div className="h-6 bg-white/20 rounded w-16"></div>
        <div className="h-6 bg-white/20 rounded w-20"></div>
        <div className="h-6 bg-white/20 rounded w-14"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="h-4 bg-white/20 rounded w-24"></div>
        <div className="h-4 bg-white/20 rounded w-16"></div>
      </div>
    </motion.div>
  );

  const ListSkeleton = () => (
    <motion.div
      className={`space-y-3 ${className}`}
      variants={animated ? skeletonVariants : {}}
      animate={animated ? "loading" : ""}
    >
      <div className="h-4 bg-white/20 rounded w-full"></div>
      <div className="h-4 bg-white/20 rounded w-4/5"></div>
      <div className="h-4 bg-white/20 rounded w-3/4"></div>
    </motion.div>
  );

  const ProfileSkeleton = () => (
    <motion.div
      className={`flex items-center space-x-4 ${className}`}
      variants={animated ? skeletonVariants : {}}
      animate={animated ? "loading" : ""}
    >
      <div className="w-16 h-16 bg-white/20 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-white/20 rounded w-1/2"></div>
        <div className="h-4 bg-white/20 rounded w-1/3"></div>
      </div>
    </motion.div>
  );

  const TableSkeleton = () => (
    <motion.div
      className={`space-y-3 ${className}`}
      variants={animated ? skeletonVariants : {}}
      animate={animated ? "loading" : ""}
    >
      <div className="grid grid-cols-4 gap-4">
        <div className="h-8 bg-white/20 rounded"></div>
        <div className="h-8 bg-white/20 rounded"></div>
        <div className="h-8 bg-white/20 rounded"></div>
        <div className="h-8 bg-white/20 rounded"></div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          <div className="h-6 bg-white/20 rounded"></div>
          <div className="h-6 bg-white/20 rounded"></div>
          <div className="h-6 bg-white/20 rounded"></div>
          <div className="h-6 bg-white/20 rounded"></div>
        </div>
      ))}
    </motion.div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return <CardSkeleton />;
      case "list":
        return <ListSkeleton />;
      case "profile":
        return <ProfileSkeleton />;
      case "table":
        return <TableSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
