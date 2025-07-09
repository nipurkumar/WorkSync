// components/Stats.js
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Briefcase, DollarSign, Globe } from "lucide-react";

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Users",
      description: "Freelancers and clients worldwide",
      color: "text-blue-400",
    },
    {
      icon: Briefcase,
      value: "5,000+",
      label: "Jobs Completed",
      description: "Successfully finished projects",
      color: "text-green-400",
    },
    {
      icon: DollarSign,
      value: "$2M+",
      label: "Total Earnings",
      description: "Paid out to freelancers",
      color: "text-yellow-400",
    },
    {
      icon: Globe,
      value: "50+",
      label: "Countries",
      description: "Global reach and presence",
      color: "text-purple-400",
    },
  ];

  return (
    <section className="py-20 bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Trusted by{" "}
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Thousands
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Join a growing community of freelancers and clients who trust
            WorkSync for their blockchain-powered collaborations.
          </motion.p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <motion.h3
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-lg font-semibold text-gray-300 mb-2">
                  {stat.label}
                </p>
                <p className="text-sm text-gray-400">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
