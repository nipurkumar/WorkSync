import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  User,
  LogOut,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useWeb3 } from "../context/Web3Context";
import { truncateAddress } from "../utils/helpers";

const WalletConnect = ({ className = "" }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const {
    account,
    balance,
    user,
    connectWallet,
    disconnectWallet,
    isConnected,
    networkId,
  } = useWeb3();

  useEffect(() => {
    // Check if on correct network (1 = mainnet, 11155111 = sepolia)
    if (
      networkId &&
      networkId !== 1 &&
      networkId !== 11155111 &&
      networkId !== 1337
    ) {
      setNetworkError(true);
    } else {
      setNetworkError(false);
    }
  }, [networkId]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDropdown(false);
    toast.success("Wallet disconnected");
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy address");
    }
  };

  const openInExplorer = () => {
    const explorerUrl =
      networkId === 1
        ? `https://etherscan.io/address/${account}`
        : `https://sepolia.etherscan.io/address/${account}`;
    window.open(explorerUrl, "_blank");
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }], // Mainnet
      });
    } catch (error) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        toast.error("Please add Ethereum network to MetaMask");
      } else {
        toast.error("Failed to switch network");
      }
    }
  };

  if (!isConnected) {
    return (
      <motion.button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isConnecting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </>
        )}
      </motion.button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-white font-medium text-sm">
            {user?.name || "User"}
          </div>
          <div className="text-gray-400 text-xs">
            {truncateAddress(account)}
          </div>
        </div>
        {networkError && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-50"
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {user?.name || "User"}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {user?.email || "No email"}
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-white font-medium">
                    {parseFloat(balance).toFixed(4)} ETH
                  </span>
                </div>

                {/* Reputation */}
                {user && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-400">Reputation:</span>
                    <span className="text-purple-400 font-medium">
                      {user.reputation}
                    </span>
                  </div>
                )}

                {/* Network Status */}
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-400">Network:</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        networkError ? "bg-red-500" : "bg-green-500"
                      }`}
                    />
                    <span
                      className={
                        networkError ? "text-red-400" : "text-green-400"
                      }
                    >
                      {networkError ? "Wrong Network" : "Ethereum"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Network Error */}
              {networkError && (
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center space-x-2 text-red-400 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Wrong Network</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">
                    Please switch to Ethereum Mainnet or Sepolia Testnet
                  </p>
                  <button
                    onClick={switchNetwork}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    Switch Network
                  </button>
                </div>
              )}

              {/* Address Actions */}
              <div className="p-4 border-b border-white/10">
                <div className="text-gray-400 text-xs mb-2">Wallet Address</div>
                <div className="flex items-center space-x-2">
                  <code className="text-white text-sm font-mono bg-white/10 px-2 py-1 rounded flex-1">
                    {truncateAddress(account, 8)}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={openInExplorer}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={handleDisconnect}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletConnect;
