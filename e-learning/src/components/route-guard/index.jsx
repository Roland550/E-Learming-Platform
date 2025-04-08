import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticate, user, element }) {
  const location = useLocation();

  console.log(authenticate, user, "useruser");

  if (!authenticate) {
    // Render the element directly if the user is on the /auth route
    if (location.pathname === "/auth") {
      return <Fragment>{element}</Fragment>;
    }
    // Redirect to /auth for all other routes
    return <Navigate to="/auth" replace />;
  }

  // If authenticated and trying to access auth page
  if (authenticate && location.pathname === "/auth") {
    return <Navigate to="/" />;
  }

  if (
    authenticate &&
    user?.role !== "instructor" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }

  // For instructor routes
  if (
    authenticate &&
    user.role === "instructor" &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/instructor" />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
