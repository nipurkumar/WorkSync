// pages/Profile.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit,
  Save,
  X,
  Camera,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Award,
  Star,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import { USER_TYPES } from "../utils/constants";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user, account, refreshUserData } = useWeb3();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
    avatar: "",
    location: "",
    website: "",
    hourlyRate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        skills: user.skills || "",
        avatar: user.avatar || "",
        location: user.location || "",
        website: user.website || "",
        hourlyRate: user.hourlyRate || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this would update the user profile in the contract
      // For now, we'll simulate the update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profile updated successfully!");
      setEditing(false);
      await refreshUserData();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      skills: user.skills || "",
      avatar: user.avatar || "",
      location: user.location || "",
      website: user.website || "",
      hourlyRate: user.hourlyRate || "",
    });
    setEditing(false);
  };

  const profileStats = [
    {
      icon: Briefcase,
      label: "Jobs Completed",
      value: "12",
      color: "text-blue-400",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: "4.8",
      color: "text-yellow-400",
    },
    {
      icon: DollarSign,
      label: "Total Earned",
      value: "45.2 ETH",
      color: "text-green-400",
    },
    {
      icon: Award,
      label: "Success Rate",
      value: "96%",
      color: "text-purple-400",
    },
  ];

  const skillsArray = formData.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <h1 className="text-4xl font-bold text-white">My Profile</h1>
            <div className="flex items-center space-x-4">
              {editing ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "Saving..." : "Save"}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 glass rounded-3xl p-8"
            >
              <div className="flex items-start space-x-6 mb-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {formData.name}
                      </h2>
                      <p className="text-gray-400 mb-2">{formData.email}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user?.userType === "0"
                              ? "bg-blue-500/20 text-blue-300"
                              : user?.userType === "1"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {USER_TYPES[user?.userType]}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined 2024</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">About</h3>
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed">
                    {formData.bio || "No bio provided yet."}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Skills
                </h3>
                {editing ? (
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="JavaScript, React, Node.js, etc."
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.length > 0 ? (
                      skillsArray.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No skills added yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Location
                  </h3>
                  {editing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your location"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.location || "Not specified"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Website
                  </h3>
                  {editing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Globe className="w-4 h-4" />
                      {formData.website ? (
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {formData.website}
                        </a>
                      ) : (
                        <span>Not specified</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Hourly Rate (for freelancers) */}
              {(user?.userType === "1" || user?.userType === "2") && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Hourly Rate
                  </h3>
                  {editing ? (
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="50"
                      step="0.001"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {formData.hourlyRate
                          ? `${formData.hourlyRate} ETH/hour`
                          : "Not specified"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Stats & Wallet Info */}
            <div className="space-y-6">
              {/* Wallet Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Wallet
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Connected</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Address</p>
                    <p className="text-white font-mono text-sm break-all">
                      {account}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Statistics
                </h3>
                <div className="space-y-4">
                  {profileStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                          <span className="text-gray-300 text-sm">
                            {stat.label}
                          </span>
                        </div>
                        <span className={`font-semibold ${stat.color}`}>
                          {stat.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Verification Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Verification
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Email</span>
                    </div>
                    <span className="text-green-400 text-sm">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Profile</span>
                    </div>
                    <span className="text-green-400 text-sm">Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300 text-sm">KYC</span>
                    </div>
                    <span className="text-yellow-400 text-sm">Pending</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
