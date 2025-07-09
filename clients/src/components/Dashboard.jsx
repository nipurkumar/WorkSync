import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Star,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import {
  formatEther,
  formatTimeAgo,
  getReputationLevel,
} from "../utils/helpers";
import { JOB_STATUS, JOB_CATEGORIES } from "../utils/constants";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalEarned: 0,
    totalSpent: 0,
    pendingApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, contract, account } = useWeb3();

  useEffect(() => {
    if (contract && account) {
      loadDashboardData();
    }
  }, [contract, account]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user jobs
      const userJobs = await contract.methods.getUserJobs(account).call();
      const freelancerJobs = await contract.methods
        .getFreelancerJobs(account)
        .call();

      // Calculate stats
      const allJobs = [...userJobs, ...freelancerJobs];
      const activeJobs = allJobs.filter(
        (job) => job.status === "1" || job.status === "2"
      ).length;
      const completedJobs = allJobs.filter((job) => job.status === "3").length;

      setStats({
        totalJobs: allJobs.length,
        activeJobs,
        completedJobs,
        totalEarned: user?.totalEarned || 0,
        totalSpent: user?.totalSpent || 0,
        pendingApplications: userJobs.filter((job) => job.status === "0")
          .length,
      });

      // Get recent jobs (last 5)
      setRecentJobs(allJobs.slice(-5).reverse());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, href, color }) => (
    <Link to={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200 group"
      >
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="flex items-center text-purple-400 text-sm group-hover:text-purple-300">
          <span>Get started</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  );

  const JobCard = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-medium line-clamp-1">{job.title}</h4>
          <p className="text-gray-400 text-sm mt-1">
            {JOB_CATEGORIES[job.category]} • {formatTimeAgo(job.createdAt)}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
            job.status
          )}`}
        >
          {JOB_STATUS[job.status]}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-green-400">
            <DollarSign className="w-3 h-3 mr-1" />
            <span>{formatEther(job.budget, 2)} ETH</span>
          </div>
          <div className="flex items-center text-orange-400">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatTimeAgo(job.deadline)}</span>
          </div>
        </div>
        <Link
          to={`/job/${job.id}`}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          View →
        </Link>
      </div>
    </motion.div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "0":
        return "bg-blue-500/20 text-blue-300";
      case "1":
        return "bg-yellow-500/20 text-yellow-300";
      case "2":
        return "bg-orange-500/20 text-orange-300";
      case "3":
        return "bg-green-500/20 text-green-300";
      case "4":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-white/20 rounded-lg mb-4"></div>
              <div className="h-8 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const reputationLevel = getReputationLevel(user?.reputation || 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || "User"}!
          </h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{user?.reputation || 0} reputation</span>
              <span className={`text-sm ${reputationLevel.color}`}>
                ({reputationLevel.level})
              </span>
            </div>
            <div>•</div>
            <div>{stats.completedJobs} jobs completed</div>
          </div>
        </div>
        <Link
          to="/post-job"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Post Job</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          title="Total Jobs"
          value={stats.totalJobs}
          subtitle="All time"
          color="bg-blue-500/20"
          trend="+12%"
        />
        <StatCard
          icon={Clock}
          title="Active Jobs"
          value={stats.activeJobs}
          subtitle="In progress"
          color="bg-yellow-500/20"
        />
        <StatCard
          icon={DollarSign}
          title="Total Earned"
          value={`${formatEther(stats.totalEarned, 2)} ETH`}
          subtitle="Lifetime earnings"
          color="bg-green-500/20"
          trend="+8%"
        />
        <StatCard
          icon={Star}
          title="Reputation"
          value={user?.reputation || 0}
          subtitle={reputationLevel.level}
          color="bg-purple-500/20"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Jobs</h2>
              <Link
                to="/jobs"
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400">No jobs yet</p>
                  <Link
                    to="/jobs"
                    className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block"
                  >
                    Browse available jobs →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <QuickActionCard
                icon={Plus}
                title="Post a Job"
                description="Find the perfect freelancer for your project"
                href="/post-job"
                color="bg-purple-500/20"
              />
              <QuickActionCard
                icon={Briefcase}
                title="Browse Jobs"
                description="Find exciting opportunities to work on"
                href="/jobs"
                color="bg-blue-500/20"
              />
              <QuickActionCard
                icon={Users}
                title="View Profile"
                description="Update your profile and showcase skills"
                href="/profile"
                color="bg-green-500/20"
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Achievements
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-medium">First Job Completed</p>
                  <p className="text-gray-400 text-sm">
                    Great start on the platform!
                  </p>
                </div>
              </div>
              {stats.completedJobs >= 5 && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Job Master</p>
                    <p className="text-gray-400 text-sm">Completed 5+ jobs</p>
                  </div>
                </div>
              )}
              {user?.reputation >= 1500 && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Rising Star</p>
                    <p className="text-gray-400 text-sm">
                      High reputation score
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reputation Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Reputation</span>
              <span className="text-white font-medium">
                {user?.reputation || 0}/5000
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    ((user?.reputation || 0) / 5000) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs">
              {5000 - (user?.reputation || 0)} points to Expert level
            </p>
          </div>

          {/* Jobs Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Jobs Completed</span>
              <span className="text-white font-medium">
                {stats.completedJobs}/50
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((stats.completedJobs / 50) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs">
              {50 - stats.completedJobs} more to unlock Pro status
            </p>
          </div>

          {/* Earnings Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Earnings</span>
              <span className="text-white font-medium">
                {formatEther(stats.totalEarned, 1)}/10 ETH
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (parseFloat(formatEther(stats.totalEarned)) / 10) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs">
              {(10 - parseFloat(formatEther(stats.totalEarned))).toFixed(1)} ETH
              to milestone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
