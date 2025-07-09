// pages/Jobs.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import { JOB_CATEGORIES } from "../utils/constants";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import LoadingSpinner from "../components/LoadingSpinner";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { getAllJobs } = useWeb3();

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, selectedCategory]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await getAllJobs();
      const postedJobs = allJobs.filter(
        (job) => job.status === "0" || !job.status
      );
      setJobs(postedJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // pages/Jobs.js (continued)
  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(term) ||
          job.description?.toLowerCase().includes(term) ||
          (job.skills &&
            job.skills.some &&
            job.skills.some((skill) => skill.toLowerCase().includes(term)))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    setFilteredJobs(filtered);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner text="Loading jobs..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 font-display"
          >
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Opportunity
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover amazing projects from clients worldwide. Start building
            your reputation today.
          </motion.p>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full form-input pl-12"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select pl-12 pr-8 min-w-[200px]"
              >
                <option value="" className="bg-gray-800">
                  All Categories
                </option>
                {Object.entries(JOB_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key} className="bg-gray-800">
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            {filteredJobs.length === 0
              ? "No jobs found"
              : `Showing ${filteredJobs.length} job${
                  filteredJobs.length !== 1 ? "s" : ""
                }`}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="ml-2 text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id || index}
                job={job}
                index={index}
                onClick={() => handleJobClick(job)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedCategory
                ? "Try adjusting your search filters"
                : "Be the first to post a job!"}
            </p>
            {!searchTerm && !selectedCategory && (
              <button
                onClick={() => (window.location.href = "/post-job")}
                className="btn-primary"
              >
                Post the First Job
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Job Modal */}
      <JobModal
        job={selectedJob}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onApply={() => {
          setShowModal(false);
          loadJobs(); // Refresh jobs after applying
        }}
      />
    </div>
  );
};

export default Jobs;
