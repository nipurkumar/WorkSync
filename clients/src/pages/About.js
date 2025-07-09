// pages/About.js
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Shield,
  Zap,
  Globe,
  Users,
  Heart,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Built on blockchain technology to ensure transparent and secure transactions.",
      color: "text-blue-400",
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description:
        "Breaking down geographical barriers to connect talent worldwide.",
      color: "text-green-400",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Pioneering the future of work with cutting-edge technology.",
      color: "text-yellow-400",
    },
    {
      icon: Heart,
      title: "Community First",
      description:
        "Building a supportive ecosystem for freelancers and clients.",
      color: "text-purple-400",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "Platform Launch",
      description: "WorkSync beta launched with core features",
      icon: Target,
    },
    {
      year: "2024",
      title: "Smart Contracts",
      description: "Deployed secure escrow system on blockchain",
      icon: Shield,
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "10,000+ users across 50+ countries",
      icon: Globe,
    },
    {
      year: "2024",
      title: "Feature Complete",
      description: "Advanced matching and AI-powered recommendations",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About{" "}
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              WorkSync
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the freelance economy by creating a
            decentralized platform where talent meets opportunity without
            traditional barriers.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-12 mb-20 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            To democratize the global workforce by providing a secure,
            transparent, and efficient platform where freelancers and clients
            can collaborate directly without intermediaries, powered by
            blockchain technology and smart contracts.
          </p>
        </motion.div>

        {/* Values Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Values</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at WorkSync
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-6`}
                  >
                    <Icon className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-400">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Journey</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Key milestones in building the future of freelancing
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`flex-1 ${
                        index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                      }`}
                    >
                      <div className="glass rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {milestone.title}
                            </h3>
                            <p className="text-purple-400 font-medium">
                              {milestone.year}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-400">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-gray-900 z-10"></div>

                    <div className="flex-1"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="glass rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-12">
            WorkSync by the Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                10,000+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">
                5,000+
              </div>
              <div className="text-gray-400">Jobs Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                $2M+
              </div>
              <div className="text-gray-400">Total Paid Out</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">50+</div>
              <div className="text-gray-400">Countries</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
