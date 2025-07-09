// components/RecentApplications.js
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Send,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Eye,
} from "lucide-react";
import { formatEther, formatTimeAgo } from "../utils/helpers";

const RecentApplications = ({ applications, userType }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "accepted":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {userType === "1" ? "My Applications" : "Recent Applications"}
        </h2>
        <Link
          to="/applications"
          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No applications yet
            </h3>
            <p className="text-gray-400 text-sm">
              {userType === "1"
                ? "Apply to jobs to see your applications here"
                : "Applications to your jobs will appear here"}
            </p>
            {userType === "1" && (
              <Link
                to="/jobs"
                className="btn-primary mt-4 inline-flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Find Jobs</span>
              </Link>
            )}
          </div>
        ) : (
          applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-medium group-hover:text-purple-300 transition-colors">
                      {application.jobTitle}
                    </h3>
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {application.proposal}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatEther(application.budget)} ETH</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Applied {formatTimeAgo(application.appliedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RecentApplications;
