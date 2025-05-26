import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/auth-context";
import { StudentContex } from "@/context/student-context";
import { getCurrentCourseProgressService } from "@/service";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";


function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const {auth} = useContext(AuthContext)
  const {studentCurrentCourseProgress, setStudentCurrentCourseProgress} = useContext(StudentContex);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const params = useParams()
  console.log("params", params);
  const {id} = params;
  async function fecthCurrentCourseProgress() {
    if (!auth?.user?._id || !id) return;
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);

    console.log("response", response);
    if (response?.success) {
      if (!response?.data?.isEnrolled) {
        setLockCourse(true)
      }else{
         setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          courseProgress: response?.data?.progress
         });
        if( response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return
        }
      }
   
    } 
    
  }

  useEffect(() => {
    fecthCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if(showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 15000);
    }
  },[showConfetti])
  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {
        showConfetti && <Confetti />
      }
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-black bg-white"size="sm" onClick={() => navigate('/student-courses')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to my course
            </Button>

        </div>
      </div>
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this course</DialogTitle>
            <DialogDescription>
              Please enroll in this course to view the content.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulation!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3 ">
              <Label>You have successfully completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button>My Courses Pages</Button>
                <Button>Rewatch this course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default StudentViewCourseProgressPage;