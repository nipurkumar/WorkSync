// components/JobCard.js
import React from "react";
import { motion } from "framer-motion";
import { Clock, User, Tag, Calendar } from "lucide-react";
import { formatTimeAgo, formatCurrency } from "../utils/helpers";
import { JOB_CATEGORIES } from "../utils/constants";

const JobCard = ({ job, index, onClick }) => {
  // Handle missing or undefined job data
  if (!job) return null;

  const {
    title = "Untitled Job",
    description = "No description provided",
    budget = "0",
    deadline,
    category = "0",
    skills = [],
    client,
    createdAt,
    applicants = [],
  } = job;

  // Format budget safely - handle both Wei and ETH formats
  const formatBudget = (budget) => {
    try {
      // If budget is already a decimal number or string, treat as ETH
      const numBudget = parseFloat(budget);
      if (!isNaN(numBudget)) {
        return formatCurrency(numBudget, "ETH", 3);
      }
      return "0 ETH";
    } catch (error) {
      console.warn("Budget formatting error:", error);
      return "0 ETH";
    }
  };

  // Format deadline safely
  const formatDeadline = (deadline) => {
    try {
      if (!deadline) return "No deadline set";

      if (typeof deadline === "string") {
        const date = new Date(deadline);
        return date.toLocaleDateString();
      }

      return formatTimeAgo(deadline);
    } catch (error) {
      return "Invalid deadline";
    }
  };

  // Format skills safely
  const skillsArray = Array.isArray(skills)
    ? skills
    : typeof skills === "string"
    ? skills.split(",").map((s) => s.trim())
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="job-card group"
      onClick={() => onClick && onClick(job)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <User className="w-4 h-4" />
            <span>
              By{" "}
              {client
                ? `${client.slice(0, 6)}...${client.slice(-4)}`
                : "Anonymous"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            {formatBudget(budget)}
          </div>
          <div className="text-sm text-gray-400">Budget</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-4 line-clamp-3">{description}</p>

      {/* Category */}
      <div className="flex items-center space-x-2 mb-4">
        <Tag className="w-4 h-4 text-purple-400" />
        <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
          {JOB_CATEGORIES[category] || "Other"}
        </span>
      </div>

      {/* Skills */}
      {skillsArray.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {skillsArray.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
          {skillsArray.length > 3 && (
            <span className="text-xs bg-gray-500/20 text-gray-300 px-2 py-1 rounded-full">
              +{skillsArray.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{formatDeadline(deadline)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{createdAt ? formatTimeAgo(createdAt) : "Just posted"}</span>
        </div>
      </div>

      {/* Applicants count */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">
          {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
        </span>
      </div>
    </motion.div>
  );
};

export default JobCard;
