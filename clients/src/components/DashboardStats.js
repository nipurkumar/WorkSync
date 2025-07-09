// components/DashboardStats.js
import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

const DashboardStats = ({ stats, userType }) => {
  const getStatsForUserType = () => {
    if (userType === "0") {
      // Client stats
      return [
        {
          icon: Briefcase,
          label: "Total Jobs Posted",
          value: stats.totalJobs || 0,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
        },
        {
          icon: Clock,
          label: "Active Jobs",
          value: stats.activeJobs || 0,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
        },
        {
          icon: CheckCircle,
          label: "Completed Jobs",
          value: stats.completedJobs || 0,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        },
        {
          icon: DollarSign,
          label: "Total Spent",
          value: `${(stats.totalSpent || 0).toFixed(3)} ETH`,
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
        },
      ];
    } else if (userType === "1") {
      // Freelancer stats
      return [
        {
          icon: Users,
          label: "Applications Sent",
          value: stats.totalApplications || 0,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
        },
        {
          icon: CheckCircle,
          label: "Accepted",
          value: stats.acceptedApplications || 0,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        },
        {
          icon: Briefcase,
          label: "Jobs Completed",
          value: stats.completedJobs || 0,
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
        },
        {
          icon: TrendingUp,
          label: "Total Earnings",
          value: `${(stats.totalEarnings || 0).toFixed(3)} ETH`,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
        },
      ];
    } else {
      // Both (hybrid stats)
      return [
        {
          icon: Briefcase,
          label: "Jobs Posted",
          value: stats.totalJobs || 0,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
        },
        {
          icon: Users,
          label: "Applications",
          value: stats.totalApplications || 0,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        },
        {
          icon: CheckCircle,
          label: "Completed",
          value: stats.completedJobs || 0,
          color: "text-purple-400",
          bgColor: "bg-purple-500/20",
        },
        {
          icon: DollarSign,
          label: "Balance",
          value: `${(
            (stats.totalEarnings || 0) - (stats.totalSpent || 0)
          ).toFixed(3)} ETH`,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
        },
      ];
    }
  };

  const statsData = getStatsForUserType();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DashboardStats;
