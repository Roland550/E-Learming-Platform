

import { useLocation , Navigate} from "react-router-dom";
import { Fragment } from "react";
function RouteGuard({ authenticate, user, element }) {
  const location = useLocation();
  
  console.log(authenticate, user, "useruser");
  
  if (!authenticate && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated and trying to access auth page
  if (authenticate && location.pathname === "/auth") {
    return <Navigate to="/" replace />;
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
