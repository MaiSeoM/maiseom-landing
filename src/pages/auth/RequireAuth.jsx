// src/auth/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Chargement de votre session...</p>
      </div>
    );
  }

  if (!user) {
    // non connecté → redirection vers /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
