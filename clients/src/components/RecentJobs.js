// components/RecentJobs.js
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  Plus,
  MoreVertical,
} from "lucide-react";
import {
  formatEther,
  formatTimeAgo,
  getJobStatusColor,
} from "../utils/helpers";
import { JOB_STATUS, JOB_CATEGORIES } from "../utils/constants";

const RecentJobs = ({ jobs, userType, onJobAction }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "0":
        return <Clock className="w-4 h-4" />;
      case "1":
        return <Users className="w-4 h-4" />;
      case "2":
        return <Eye className="w-4 h-4" />;
      case "3":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleJobAction = (jobId, action) => {
    // Handle job actions (edit, delete, etc.)
    console.log(`Action ${action} on job ${jobId}`);
    if (onJobAction) onJobAction();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {userType === "0" ? "Posted Jobs" : "Recent Jobs"}
        </h2>
        <Link
          to="/jobs"
          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No jobs yet
            </h3>
            <p className="text-gray-400 text-sm">
              {userType === "0"
                ? "Post your first job to get started"
                : "Apply to jobs to see them here"}
            </p>
            {userType === "0" && (
              <Link
                to="/post-job"
                className="btn-primary mt-4 inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post Job</span>
              </Link>
            )}
          </div>
        ) : (
          jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              // components/RecentJobs.js (continued)
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-medium group-hover:text-purple-300 transition-colors">
                      {job.title}
                    </h3>
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getJobStatusColor(
                        JOB_STATUS[job.status]
                      )}`}
                    >
                      {getStatusIcon(job.status)}
                      <span>{JOB_STATUS[job.status]}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatEther(job.budget)} ETH</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatTimeAgo(job.deadline)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{job.applicants?.length || 0} applicants</span>
                    </div>
                  </div>
                </div>

                {userType === "0" && (
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleJobAction(job.id, "view")}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleJobAction(job.id, "edit")}
                      className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleJobAction(job.id, "delete")}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RecentJobs;
