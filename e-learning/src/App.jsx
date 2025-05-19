import { Routes, Route } from "react-router-dom";

import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardPage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import StudentViewCoursePage from "./pages/student/course";
import StudentViewCourseDetails from "./pages/student/course-details";
import StudentCoursesPage from "./pages/student/student-courses";

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
      path="/instructor/create-new-course"
      element={
        <RouteGuard 
        element={<AddNewCoursePage/>}
        authenticate={auth?.authenticate}
        user={auth?.user}
         />
      }
       />
      <Route 
      path="/instructor/edit-course/:courseId"
      element={
        <RouteGuard 
        element={<AddNewCoursePage/>}
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
        <Route path="course" element={<StudentViewCoursePage />} />
        <Route path="course/details/:id" element={<StudentViewCourseDetails />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
       </Route>
       
       <Route path="*" element={<NotFoundPage />} />
    
    </Routes>
  );
}

export default App;
