// components/Hero.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Shield,
  Zap,
  Globe,
  Users,
  Wallet,
  Plus,
  Search,
} from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import WalletModal from "./WalletModal";

const Hero = () => {
  const { account, user, connectWallet, isConnected } = useWeb3();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleGetStarted = () => {
    if (!isConnected) {
      setShowWalletModal(true);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
        <div className="absolute inset-0 bg-mesh opacity-10" />
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8"
          >
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-white">
              🚀 Decentralized & Secure Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-display leading-tight"
          >
            The Future of{" "}
            <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Freelancing
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Connect directly with clients and freelancers through blockchain
            technology. No middlemen, no high fees, just pure peer-to-peer
            collaboration powered by smart contracts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            {isConnected ? (
              user?.isRegistered ? (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {(user.userType === "0" || user.userType === "2") && (
                    <Link
                      to="/post-job"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Post a Job</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                  {(user.userType === "1" || user.userType === "2") && (
                    <Link
                      to="/jobs"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Search className="w-5 h-5" />
                      <span>Find Jobs</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Users className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/register"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Users className="w-5 h-5" />
                    <span>Complete Registration</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/jobs"
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Browse Jobs</span>
                  </Link>
                </div>
              )
            ) : (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  onClick={handleGetStarted}
                  className="btn-primary flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Watch Demo</span>
                </button>
              </div>
            )}
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="glass rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <Zap className="w-8 h-8 text-yellow-400 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Instant Payments
              </h3>
              <p className="text-gray-400 text-sm">
                Get paid immediately with cryptocurrency
              </p>
            </div>
            <div className="glass rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <Shield className="w-8 h-8 text-green-400 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Secure Escrow
              </h3>
              <p className="text-gray-400 text-sm">
                Smart contracts protect both parties
              </p>
            </div>
            <div className="glass rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <Globe className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Global Access
              </h3>
              <p className="text-gray-400 text-sm">
                Work with anyone, anywhere in the world
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                2.5%
              </div>
              <div className="text-gray-400 text-sm">Platform Fees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                100%
              </div>
              <div className="text-gray-400 text-sm">Transparent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                ∞
              </div>
              <div className="text-gray-400 text-sm">Opportunities</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <WalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </section>
  );
};

export default Hero;
