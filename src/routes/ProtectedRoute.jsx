import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfos } from "../redux/authSlice";

// typesMembre = ["Student", "Instructor", "Admin"]
const ProtectedRoute = ({ children, typesMembre }) => {
  const user = useSelector(selectUserInfos);

  if (!user) {
    // pas connecté → redirection login
    return <Navigate to="/login" replace />;
  }

  if (typesMembre && !typesMembre.includes(user.TypeMembre)) {
    // connecté mais TypeMembre non autorisé
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // accès autorisé
};

export default ProtectedRoute;
