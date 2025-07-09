// pages/PostJob.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar, DollarSign, FileText, Tag, Plus, X } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import { JOB_CATEGORIES } from "../utils/constants";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "0",
    budget: "",
    deadline: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { postJob, account, user } = useWeb3();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!user?.isRegistered) {
      toast.error("Please register first");
      return;
    }

    if (user.userType === "1") {
      toast.error("Only clients can post jobs");
      return;
    }

    if (formData.skills.length === 0) {
      toast.error("Please add at least one skill requirement");
      return;
    }

    setLoading(true);
    try {
      await postJob(formData);
      toast.success("Job posted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Post job error:", error);

      if (error.message.includes("User rejected")) {
        toast.error("Transaction was rejected");
      } else if (error.message.includes("insufficient funds")) {
        toast.error("Insufficient funds for transaction");
      } else {
        toast.error("Failed to post job. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSkillInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Check if user can post jobs
  if (!user?.isRegistered) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Registration Required
          </h2>
          <p className="text-gray-400 mb-6">
            Please register first to post jobs.
          </p>
          <button onClick={() => navigate("/register")} className="btn-primary">
            Register Now
          </button>
        </div>
      </div>
    );
  }

  if (user.userType === "1") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">Only clients can post jobs.</p>
          <button onClick={() => navigate("/jobs")} className="btn-primary">
            Browse Jobs Instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
              Post a New{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Job
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find the perfect freelancer for your project. Create a detailed
              job posting to attract top talent.
            </p>
          </div>

          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  <FileText className="inline w-6 h-6 mr-2" />
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-input text-lg"
                  placeholder="e.g., Build a React E-commerce Website"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="form-textarea text-lg"
                  placeholder="Describe your project in detail. Include requirements, deliverables, and any specific preferences..."
                />
              </div>

              {/* Category and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <Tag className="inline w-6 h-6 mr-2" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select text-lg"
                    required
                  >
                    {Object.entries(JOB_CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key} className="bg-gray-800">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3 text-lg">
                    <DollarSign className="inline w-6 h-6 mr-2" />
                    Budget (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="0.001"
                    className="form-input text-lg"
                    placeholder="0.5"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  <Calendar className="inline w-6 h-6 mr-2" />
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="form-input text-lg"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  Required Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillInputKeyPress}
                    className="form-input flex-1"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || !account}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Posting Job...</span>
                  </div>
                ) : (
                  "Post Job"
                )}
              </motion.button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Low Platform Fee
              </h3>
              <p className="text-gray-400 text-sm">
                Only 2.5% platform fee compared to 10-20% on traditional
                platforms
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Secure Escrow</h3>
              <p className="text-gray-400 text-sm">
                Your funds are held securely in smart contracts until work is
                completed
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Tag className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Global Talent</h3>
              <p className="text-gray-400 text-sm">
                Access to freelancers from around the world without geographical
                restrictions
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostJob;
