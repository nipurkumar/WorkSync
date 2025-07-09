// utils/helpers.js
import Web3 from "web3";

export const formatEther = (wei) => {
  if (!wei) return "0";

  // If it's already a string that looks like ETH (contains decimal), return as is
  if (
    typeof wei === "string" &&
    (wei.includes(".") || parseFloat(wei) < 1000)
  ) {
    return wei;
  }

  // If it's a number less than 1000, assume it's already in ETH
  if (typeof wei === "number" && wei < 1000) {
    return wei.toString();
  }

  try {
    // Only use fromWei for actual Wei values (big numbers)
    return Web3.utils.fromWei(wei.toString(), "ether");
  } catch (error) {
    // If conversion fails, return the original value
    console.warn("formatEther conversion failed:", error);
    return wei.toString();
  }
};

export const formatWei = (ether) => {
  if (!ether) return "0";
  try {
    return Web3.utils.toWei(ether.toString(), "ether");
  } catch (error) {
    console.warn("formatWei conversion failed:", error);
    return ether.toString();
  }
};

// Safe number formatting
export const formatCurrency = (amount, currency = "ETH", decimals = 4) => {
  if (!amount) return `0 ${currency}`;

  let numericAmount;
  if (typeof amount === "string") {
    numericAmount = parseFloat(amount);
  } else {
    numericAmount = amount;
  }

  if (isNaN(numericAmount)) return `0 ${currency}`;

  return `${numericAmount.toFixed(decimals)} ${currency}`;
};

// Rest of your helper functions remain the same...
export const formatTimeAgo = (timestamp) => {
  const now = Date.now();
  const time = parseInt(timestamp) * 1000;
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

export const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDeadline = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const now = new Date();
  const diff = date - now;

  if (diff < 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
  return "Less than 1 hour left";
};

export const truncateAddress = (address, length = 6) => {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-4)}`;
};

export const truncateText = (text, length = 100) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateEthereumAddress = (address) => {
  return Web3.utils.isAddress(address);
};

export const calculatePlatformFee = (amount, feePercentage = 0.025) => {
  return (parseFloat(amount) * feePercentage).toFixed(4);
};

export const calculateSecurityDeposit = (amount, percentage = 0.1) => {
  return (parseFloat(amount) * percentage).toFixed(4);
};

// Additional utility functions
export const getJobStatusColor = (status) => {
  const statusColors = {
    Posted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "In Progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Submitted: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    Completed: "bg-green-500/20 text-green-300 border-green-500/30",
    Cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
    Disputed: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };

  return (
    statusColors[status] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
  );
};

export const getUserTypeColor = (userType) => {
  const typeColors = {
    Client: "bg-blue-500/20 text-blue-300",
    Freelancer: "bg-green-500/20 text-green-300",
    Both: "bg-purple-500/20 text-purple-300",
  };

  return typeColors[userType] || "bg-gray-500/20 text-gray-300";
};
