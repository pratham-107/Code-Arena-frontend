import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    // User is authenticated, redirect to home
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, render the public content
  return children;
};

export default PublicRoute;
