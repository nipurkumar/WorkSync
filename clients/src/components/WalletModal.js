// components/WalletModal.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, AlertCircle, CheckCircle } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import { toast } from "react-hot-toast";

const WalletModal = ({ onClose }) => {
  const { connectWallet, networkId } = useWeb3();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connectWallet();
      onClose();
    } catch (error) {
      console.error("Connection failed:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  const walletOptions = [
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Connect with MetaMask wallet",
      available: typeof window !== "undefined" && window.ethereum,
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      description: "Connect with WalletConnect",
      available: false,
      comingSoon: true,
    },
    {
      name: "Coinbase Wallet",
      icon: "💙",
      description: "Connect with Coinbase Wallet",
      available: false,
      comingSoon: true,
    },
  ];

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
          className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {walletOptions.map((wallet, index) => (
              <motion.button
                key={wallet.name}
                onClick={wallet.available ? handleConnect : undefined}
                disabled={!wallet.available || connecting}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl border transition-all ${
                  wallet.available
                    ? "border-white/20 hover:border-purple-500/50 hover:bg-white/5 cursor-pointer"
                    : "border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50"
                }`}
                whileHover={wallet.available ? { scale: 1.02 } : {}}
                whileTap={wallet.available ? { scale: 0.98 } : {}}
              >
                <div className="text-2xl">{wallet.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">
                      {wallet.name}
                    </span>
                    {wallet.available && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {wallet.comingSoon && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{wallet.description}</p>
                </div>
                {connecting && wallet.available && (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 font-medium text-sm">
                  Why connect a wallet?
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Your wallet is used to sign transactions and interact with
                  smart contracts securely. No personal information is stored.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              By connecting, you agree to our{" "}
              <a
                href="/terms"
                className="text-purple-400 hover:text-purple-300"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-purple-400 hover:text-purple-300"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletModal;
