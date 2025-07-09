import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Shield, Zap, Globe, Users, Lock, TrendingUp } from "lucide-react";

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Shield,
      title: "Secure Escrow",
      description:
        "Smart contracts automatically handle payments, ensuring funds are only released when work is completed.",
      image: "B:WorkSync 2clientspublicassetsimages\feature-1.jpg",
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description:
        "No more waiting for weeks. Get paid immediately upon job completion with blockchain technology.",
      image: "B:WorkSync 2clientspublicassetsimagescrypto-payment.jpg",
    },
    {
      icon: Globe,
      title: "Global Access",
      description:
        "Work with anyone, anywhere in the world. No geographical restrictions or currency barriers.",
      image: "B:WorkSync 2clientspublicassetsimagesglobal-network.jpg",
    },
    {
      icon: Users,
      title: "WorkSynclized Reviews",
      description:
        "Build your reputation with transparent, tamper-proof reviews stored on the blockchain.",
      image: "B:WorkSync 2clientspublicassetsimages\feature-1.jpg",
    },
    {
      icon: Lock,
      title: "Encrypted Delivery",
      description:
        "Your work is encrypted and secure. Only the client can access it after payment confirmation.",
      image: "B:WorkSync 2clientspublicassetsimagessecurity-shield.jpg",
    },
    {
      icon: TrendingUp,
      title: "Low Fees",
      description:
        "Pay only 2.5% platform fee compared to 10-20% on traditional platforms.",
      image: "B:WorkSync 2clientspublicassetsimagescrypto-payment.jpg",
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 font-display"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              WorkSync
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Experience the next generation of freelancing with
            blockchain-powered features that put control back in your hands.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                {/* Background Image */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
