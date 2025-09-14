import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RouteGuard = ({ authenticated, user, element }) => {
  const location = useLocation();
  //   if (authenticated && !user) {
  //     return null; // or a loading spinner
  //   }

  console.log("userRole: ", user?.role, ", authenticated: ", authenticated);
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  if (
    authenticated &&
    user?.role === "user" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }

  if (
    authenticated &&
    user?.role === "instructor" &&
    (location.pathname.startsWith("/auth") || location.pathname === "/")
  ) {
    return <Navigate to="/instructor" replace />;
  }

  return <Fragment>{element}</Fragment>;
};

export default RouteGuard;
