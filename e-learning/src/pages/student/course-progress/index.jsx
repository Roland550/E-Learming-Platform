import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContex } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewSeervice,
  resetCourseProgressService,
} from "@/service";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import {  useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContex);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 

  const { id } = useParams();
  async function fecthCurrentCourseProgress() {
    // if (!auth?.user?._id || !id) return;

    const response = await getCurrentCourseProgressService(auth?.user?._id, id);

    console.log("response", response);
    if (response?.success) {
      if (!response?.data?.isEnrolled) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
          // completed: response?.data?.completed,
          // completionDate: response?.data?.completionDate
        });
         // Show congratulation dialog if completed
        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        if (response?.data?.progress.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("login here");

          //this logix help to get the first lecture progress and  finish the course should go to the next lecture
          const lastIndexOfViewedAsTrue = response?.data?.progress?.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );
          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewSeervice(
        auth?.user?._id,
        
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture?._id
      );

      if (response?.success) {
        fecthCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      setCurrentLecture(null)
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fecthCurrentCourseProgress();
      
    }
  }

  useEffect(() => {
    fecthCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress();
    }
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 15000);
    }
  }, [showConfetti]);

  console.log(currentLecture, "currentLectureProgress");

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-black bg-white"
            size="sm"
            onClick={() => navigate("/student-courses")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to my course
          </Button>
          <h1 className="text-lg font-bold hidden md:block ">
            {studentCurrentCourseProgress?.courseDetails?.title ||
              "Course Progress"}
          </h1>
        </div>
        <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSidebarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-2 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">
              {currentLecture?.title }
            </h2>
          </div>
        </div>
        <div
          className={`fixed top-[65px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-1 border-gray-700  transition-all duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                className=" text-white rounded-none h-full"
                value="content"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                className=" text-white rounded-none h-full"
                value="overview"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum?.map(
                    (item) => {
                      return (
                        <div
                          key={item._id}
                          className="flex items-center space-x-2 text-white text-sm font-bold cursor-pointer"
                        >
                          {studentCurrentCourseProgress?.progress?.find(
                            (progressItem) =>
                              String(progressItem.lectureId) === String(item._id)
                          )?.viewed ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Play className="h-4 w-4 text-gray-400" />
                          )}
                          <span>{item?.title}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 ">
                  <h2 className="text-xl font-bold mb-4">About this course</h2>

                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
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
        <DialogContent  className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulation!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3 ">
              <Label>You have successfully completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>My Courses Pages</Button>
                <Button onClick={handleRewatchCourse}>Rewatch this course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default StudentViewCourseProgressPage;
