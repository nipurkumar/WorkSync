// pages/Home.js
import React from "react";
import { motion } from "framer-motion";
import { useWeb3 } from "../context/Web3Context";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const { loading } = useWeb3();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Initializing WorkSync..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
    </motion.div>
  );
};

export default Home;
