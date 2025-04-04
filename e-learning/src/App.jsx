import { Routes, Route } from "react-router-dom";

import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardPage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage/>}
            authenticate={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      <Route 
      path="/instructor"
      element={
        <RouteGuard 
        element={<InstructorDashboardPage/>}
        authenticate={auth?.authenticate}
        user={auth?.user}
         />
      }
       />

      <Route
       path="/"
       element={
        <RouteGuard 
        element={<StudentViewCommonLayout />}
        authenticate={auth?.authenticate}
        user={auth?.user}
         />
       }
       >
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
       </Route>
       
    
    </Routes>
  );
}

export default App;
