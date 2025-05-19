import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";


function StudentViewCommonHeader(){
    const navigate = useNavigate()
     const {resetCredential} = useContext(AuthContext)
  const handleLogout = () => {
    resetCredential();
    sessionStorage.clear();
  }; 
    return (
       <header className="flex items-center justify-between p-4 border-b relative">
         <div className="flex items-center spacex-4">
            <Link to="/home" className="flex items-center">
            <GraduationCap className="w-8 h-8  mr-4 hover:text-black" />
            <span className="font-extrabold md:text-xl text-[14px]">E-Learning</span>
            </Link>

            <div className="flex items-center space-x-2">
                <Button variant='ghost' className="text-[14px] md:text-[16px] font-medium cursor-pointer"
                onClick={() => navigate("/course")}>
                    Explore Courses
                </Button>
            </div>

            
         </div>
         <div className="flex items-center space-x-4">
                <div className="flex gap-4 items-center">
                   <div className="flex items-center gap-3">
                    <span onClick={() => navigate("/student-courses")} className="text-[14px] md:text-[16px] font-medium cursor-pointer">My Courses</span>
                    <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
                   </div>
                   <Button  className=" cursor-pointer" onClick={handleLogout}>Sign Out</Button>
                </div>
            </div>
       </header>
    );
}

export default StudentViewCommonHeader;