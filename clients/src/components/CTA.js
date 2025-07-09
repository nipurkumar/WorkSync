// components/CTA.js
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";

const CTA = () => {
  const { isConnected, user } = useWeb3();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Shield,
      title: "Secure",
      description: "Smart contract protection",
    },
    {
      icon: Zap,
      title: "Fast",
      description: "Instant cryptocurrency payments",
    },
    {
      icon: Users,
      title: "Global",
      description: "Connect with worldwide talent",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
      <div className="container mx-auto px-4">
        <div ref={ref} className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to{" "}
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transform
            </span>{" "}
            Your Freelancing Experience?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of freelancers and clients who have already
            discovered the power of decentralized collaboration.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                  <h3 className="text-white font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            {isConnected ? (
              user?.isRegistered ? (
                <Link
                  to="/dashboard"
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Complete Registration</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )
            ) : (
              <Link to="/" className="btn-primary flex items-center space-x-2">
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <Link
              to="/about"
              className="btn-secondary flex items-center space-x-2"
            >
              <span>Learn More</span>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-gray-400 text-sm mb-4">
              Trusted by developers worldwide
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-2xl">⚡</div>
              <div className="text-2xl">🔒</div>
              <div className="text-2xl">🌍</div>
              <div className="text-2xl">💎</div>
              <div className="text-2xl">🚀</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
