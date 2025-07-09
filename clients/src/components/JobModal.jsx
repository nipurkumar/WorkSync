// components/JobModal.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Calendar, User, Tag, Clock, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { useWeb3 } from "../context/Web3Context";
import { formatEther, formatTimeAgo } from "../utils/helpers";
import { JOB_CATEGORIES } from "../utils/constants";

const JobModal = ({ job, isOpen, onClose }) => {
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const { contract, account, user } = useWeb3();

  const handleApply = async () => {
    if (!contract || !account) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!user?.isRegistered) {
      toast.error("Please register first");
      return;
    }

    if (user.userType === "0") {
      toast.error("Only freelancers can apply for jobs");
      return;
    }

    if (!proposal.trim()) {
      toast.error("Please write a proposal");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.methods
        .applyForJob(job.id, proposal)
        .send({ from: account });

      toast.success("Application submitted successfully!");
      onClose();
      setProposal("");
    } catch (error) {
      console.error("Application error:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {job.title}
                </h2>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>By {job.clientName || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Posted {formatTimeAgo(job.createdAt)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Job Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Apply Section */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Submit Your Proposal
                    </h3>
                    <textarea
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      placeholder="Write your proposal here. Explain why you're the best fit for this project..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="6"
                    />
                    <motion.button
                      onClick={handleApply}
                      disabled={loading}
                      className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: loading ? 1 : 0.95 }}
                    >
                      <Send className="w-5 h-5" />
                      <span>
                        {loading ? "Submitting..." : "Submit Proposal"}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Budget */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">Budget</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {formatEther(job.budget)} ETH
                  </div>
                </div>

                {/* Deadline */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <span className="text-white font-semibold">Deadline</span>
                  </div>
                  <div className="text-xl font-bold text-orange-400">
                    {formatTimeAgo(job.deadline)}
                  </div>
                </div>

                {/* Category */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">Category</span>
                  </div>
                  <div className="text-purple-400 font-medium">
                    {JOB_CATEGORIES[job.category]}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobModal;
