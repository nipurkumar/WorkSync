// components/AuthModal.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Briefcase, UserCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AuthModal = ({ mode, onClose, onSwitchMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "freelancer",
    otp: "",
  });
  const [step, setStep] = useState(mode === "signup" ? "signup" : "login");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendOTP = async () => {
    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      alert("OTP sent to your email!");
    }, 1000);
  };

  const verifyOTP = async () => {
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      if (formData.otp === "123456") {
        // Mock OTP
        const userData = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          role: formData.role,
          verified: true,
        };
        login(userData);
        onClose();
      } else {
        alert("Invalid OTP");
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        name: formData.email.split("@")[0],
        email: formData.email,
        role: formData.role,
        verified: true,
      };
      login(userData);
      onClose();
      setLoading(false);
    }, 1000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      sendOTP();
    } else {
      verifyOTP();
    }
  };

  return (
    <AnimatePresence>
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
          className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {step === "login" ? "Login" : "Sign Up"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form
            onSubmit={step === "login" ? handleLogin : handleSignup}
            className="space-y-4"
          >
            {step === "signup" && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {step === "signup" && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "freelancer" })
                    }
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.role === "freelancer"
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20"
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mx-auto mb-1" />
                    Freelancer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "client" })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.role === "client"
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 mx-auto mb-1" />
                    Client
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {step === "signup" && otpSent && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Enter OTP (use 123456 for demo)"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : step === "login"
                ? "Login"
                : otpSent
                ? "Verify OTP"
                : "Send OTP"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm">
              {step === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <button
              onClick={() => {
                const newMode = step === "login" ? "signup" : "login";
                setStep(newMode);
                onSwitchMode(newMode);
                setOtpSent(false);
                setFormData({
                  email: "",
                  password: "",
                  name: "",
                  role: "freelancer",
                  otp: "",
                });
              }}
              className="text-purple-400 hover:text-purple-300 ml-2 font-medium"
            >
              {step === "login" ? "Sign up" : "Login"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
