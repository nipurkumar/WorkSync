import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Star,
  Briefcase,
  DollarSign,
  Edit3,
  Save,
  X,
  Award,
  Calendar,
  Mail,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import {
  formatEther,
  formatDate,
  getReputationLevel,
  truncateAddress,
} from "../utils/helpers";
import { USER_TYPES } from "../utils/constants";

const Profile = ({ userAddress = null, isViewOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState({
    totalJobs: 0,
    totalEarned: 0,
    totalSpent: 0,
    rating: 0,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const { user, account, contract } = useWeb3();
  const targetAddress = userAddress || account;
  const isOwnProfile = !userAddress || userAddress === account;

  useEffect(() => {
    if (contract && targetAddress) {
      loadProfileData();
    }
  }, [contract, targetAddress]);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // Load user data
      const userData = await contract.methods.users(targetAddress).call();
      setProfileData(userData);

      // Load user rating
      const rating = await contract.methods.getUserRating(targetAddress).call();

      setUserStats({
        totalJobs: userData.totalJobs,
        totalEarned: userData.totalEarned,
        totalSpent: userData.totalSpent,
        rating: rating.rating / 100,
        reviewCount: rating.count,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProfileCard = ({ title, children, className = "" }) => (
    <div
      className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );

  const StatItem = ({ icon: Icon, label, value, color = "text-white" }) => (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className={`font-semibold ${color}`}>{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Loading skeleton */}
        <div className="bg-white/10 rounded-2xl p-8 animate-pulse">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 bg-white/20 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-white/20 rounded mb-2 w-1/3"></div>
              <div className="h-4 bg-white/20 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData?.isRegistered) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Profile Not Found
        </h2>
        <p className="text-gray-400">
          {isOwnProfile
            ? "You haven't registered yet. Create your profile to get started."
            : "This user hasn't registered on the platform yet."}
        </p>
        {isOwnProfile && (
          <Link
            to="/register"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 inline-block mt-4"
          >
            Register Now
          </Link>
        )}
      </div>
    );
  }

  const reputationLevel = getReputationLevel(profileData.reputation);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2">
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {profileData.name}
              </h1>
              <div className="flex items-center space-x-4 mb-3">
                <span
                  className={`text-lg font-medium ${reputationLevel.color}`}
                >
                  {reputationLevel.level}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">
                    {userStats.rating.toFixed(1)} ({userStats.reviewCount}{" "}
                    reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                  {USER_TYPES[profileData.userType]}
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(profileData.createdAt)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{truncateAddress(targetAddress)}</span>
                </span>
              </div>
            </div>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              {isEditing ? (
                <X className="w-4 h-4" />
              ) : (
                <Edit3 className="w-4 h-4" />
              )}
              <span>{isEditing ? "Cancel" : "Edit"}</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {userStats.totalJobs}
            </div>
            <div className="text-gray-400 text-sm">Jobs Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {profileData.reputation}
            </div>
            <div className="text-gray-400 text-sm">Reputation Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {formatEther(userStats.totalEarned, 2)} ETH
            </div>
            <div className="text-gray-400 text-sm">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {userStats.rating.toFixed(1)}/5.0
            </div>
            <div className="text-gray-400 text-sm">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <ProfileCard title="About">
            {isEditing && isOwnProfile ? (
              <div className="space-y-4">
                <textarea
                  defaultValue={profileData.bio}
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex space-x-3">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 leading-relaxed">
                {profileData.bio || "No bio provided yet."}
              </p>
            )}
          </ProfileCard>

          {/* Skills */}
          <ProfileCard title="Skills & Expertise">
            {profileData.skills ? (
              <div className="flex flex-wrap gap-2">
                {profileData.skills.split(",").map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-full text-sm font-medium"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No skills listed yet.</p>
            )}
          </ProfileCard>

          {/* Contact Info */}
          <ProfileCard title="Contact Information">
            <div className="space-y-4">
              <StatItem icon={Mail} label="Email" value={profileData.email} />
              <StatItem
                icon={LinkIcon}
                label="Wallet Address"
                value={truncateAddress(targetAddress)}
              />
            </div>
          </ProfileCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reputation Details */}
          <ProfileCard title="Reputation Breakdown">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Current Level</span>
                  <span className={`font-semibold ${reputationLevel.color}`}>
                    {reputationLevel.level}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (profileData.reputation / 5000) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {profileData.reputation} / 5000 points
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Jobs Completed</span>
                  <span className="text-white">{userStats.totalJobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">
                      {userStats.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Reviews</span>
                  <span className="text-white">{userStats.reviewCount}</span>
                </div>
              </div>
            </div>
          </ProfileCard>

          {/* Activity Stats */}
          <ProfileCard title="Activity Overview">
            <div className="space-y-4">
              <StatItem
                icon={Briefcase}
                label="Total Jobs"
                value={userStats.totalJobs}
              />
              <StatItem
                icon={DollarSign}
                label="Total Earned"
                value={`${formatEther(userStats.totalEarned, 3)} ETH`}
                color="text-green-400"
              />
              {profileData.userType !== "1" && (
                <StatItem
                  icon={DollarSign}
                  label="Total Spent"
                  value={`${formatEther(userStats.totalSpent, 3)} ETH`}
                  color="text-blue-400"
                />
              )}
              <StatItem
                icon={Calendar}
                label="Member Since"
                value={formatDate(profileData.createdAt)}
              />
            </div>
          </ProfileCard>

          {/* Badges */}
          <ProfileCard title="Achievements">
            <div className="space-y-3">
              {userStats.totalJobs >= 1 && (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">First Job</p>
                    <p className="text-gray-400 text-sm">
                      Completed first project
                    </p>
                  </div>
                </div>
              )}

              {userStats.totalJobs >= 5 && (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Job Master</p>
                    <p className="text-gray-400 text-sm">
                      Completed 5+ projects
                    </p>
                  </div>
                </div>
              )}

              {profileData.reputation >= 1500 && (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Rising Star</p>
                    <p className="text-gray-400 text-sm">
                      High reputation score
                    </p>
                  </div>
                </div>
              )}

              {userStats.rating >= 4.5 && userStats.reviewCount >= 5 && (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Top Rated</p>
                    <p className="text-gray-400 text-sm">
                      Excellent client feedback
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;
