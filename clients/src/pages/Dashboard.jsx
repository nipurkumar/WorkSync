// pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  DollarSign,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import { USER_TYPES, JOB_STATUS } from "../utils/constants";
import { formatEther, formatTimeAgo } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";
import DashboardStats from "../components/DashboardStats";
import RecentJobs from "../components/RecentJobs";
import RecentApplications from "../components/RecentApplications";

const Dashboard = () => {
  const { user, contract, account } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    totalApplications: 0,
    acceptedApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    if (user?.isRegistered) {
      loadDashboardData();
    }
  }, [user, contract, account]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (contract) {
        // Load jobs and applications from contract
        const allJobs = await contract.methods.getAllJobs().call();

        if (user.userType === "0" || user.userType === "2") {
          // Client: Load posted jobs
          const userJobs = allJobs.filter(
            (job) => job.client.toLowerCase() === account.toLowerCase()
          );
          setRecentJobs(userJobs.slice(0, 5));

          // Calculate client stats
          const clientStats = {
            totalJobs: userJobs.length,
            activeJobs: userJobs.filter((job) => job.status === "0").length,
            completedJobs: userJobs.filter((job) => job.status === "3").length,
            totalSpent: userJobs.reduce(
              (sum, job) => sum + parseFloat(formatEther(job.budget)),
              0
            ),
          };
          setStats(clientStats);
        }

        if (user.userType === "1" || user.userType === "2") {
          // Freelancer: Load applications
          // This would need to be implemented in the contract
          // For now, we'll use mock data
          setRecentApplications([]);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-gray-400">
                {USER_TYPES[user?.userType]} •{" "}
                {formatTimeAgo(Date.now() / 1000)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {(user?.userType === "0" || user?.userType === "2") && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center space-x-2"
                  onClick={() => (window.location.href = "/post-job")}
                >
                  <Plus className="w-5 h-5" />
                  <span>Post Job</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <DashboardStats stats={stats} userType={user?.userType} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <RecentJobs
            jobs={recentJobs}
            userType={user?.userType}
            onJobAction={loadDashboardData}
          />

          {/* Recent Applications */}
          <RecentApplications
            applications={recentApplications}
            userType={user?.userType}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
