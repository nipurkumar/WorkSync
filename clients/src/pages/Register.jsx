// pages/Register.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { User, Mail, FileText, Code, Image, UserCheck } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
    avatar: "",
    userType: 2, // Both by default
  });
  const [loading, setLoading] = useState(false);
  const { registerUser, account } = useWeb3();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific error types
      if (error.message.includes("User rejected")) {
        toast.error("Transaction was rejected");
      } else if (error.message.includes("insufficient funds")) {
        toast.error("Insufficient funds for transaction");
      } else if (error.message.includes("network")) {
        toast.error("Network error. Please try again");
      } else {
        toast.error("Registration failed. Please try again");
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

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                Join WorkSync
              </h1>
              <p className="text-gray-300">
                Create your profile and start freelancing on the blockchain
              </p>
              {account && (
                <p className="text-sm text-gray-400 mt-2">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <User className="inline w-5 h-5 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <Mail className="inline w-5 h-5 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <FileText className="inline w-5 h-5 mr-2" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <Code className="inline w-5 h-5 mr-2" />
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., JavaScript, React, UI/UX Design"
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <Image className="inline w-5 h-5 mr-2" />
                  Avatar URL (Optional)
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* User Type */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <UserCheck className="inline w-5 h-5 mr-2" />
                  Account Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 0 })}
                    className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                      formData.userType === 0
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20"
                    }`}
                  >
                    <UserCheck className="w-5 h-5 mx-auto mb-2" />
                    Client
                    <p className="text-xs mt-1 opacity-75">
                      Post jobs and hire talent
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 1 })}
                    className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                      formData.userType === 1
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20"
                    }`}
                  >
                    <Code className="w-5 h-5 mx-auto mb-2" />
                    Freelancer
                    <p className="text-xs mt-1 opacity-75">
                      Find and apply for jobs
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 2 })}
                    className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                      formData.userType === 2
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20"
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-2" />
                    Both
                    <p className="text-xs mt-1 opacity-75">
                      Client and freelancer
                    </p>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
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
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : !account ? (
                  "Please Connect Wallet First"
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-300 text-sm text-center">
                Your profile will be stored securely on the blockchain. You can
                update it anytime from your dashboard.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
