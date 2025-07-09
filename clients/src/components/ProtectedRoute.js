// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useWeb3 } from "../context/Web3Context";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = "/",
}) => {
  const { account, user, loading } = useWeb3();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  // If authentication is required but user is not connected
  if (requireAuth && !account) {
    toast.error("Please connect your wallet to access this page");
    return <Navigate to={redirectTo} replace />;
  }

  // If authentication is required but user is not registered
  if (requireAuth && account && !user?.isRegistered) {
    toast.error("Please register to access this page");
    return <Navigate to="/register" replace />;
  }

  // If specific roles are required
  if (allowedRoles.length > 0 && user?.isRegistered) {
    const userRole =
      user.userType === "0"
        ? "client"
        : user.userType === "1"
        ? "freelancer"
        : "both";

    if (!allowedRoles.includes(userRole) && !allowedRoles.includes("both")) {
      toast.error("You do not have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If authentication is NOT required but user is already authenticated
  if (!requireAuth && account && user?.isRegistered) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
