import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContex } from "@/context/student-context";
import { createEnrollmentService, fetchStudentViewCourseDetailsService } from "@/service";

import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";

import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function StudentViewCourseDetails() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseId,
    setCurrentCourseId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContex);

  const [displayCurrentVideoPreview, setDisplayCurrentVideoPreview] =
    useState(null);
  const [showPreviewDislog, setShowPreviewDislog] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  const {auth} = useContext(AuthContext);

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setLoadingState(false);
    }
  }

  function handleSetPreview(getCurrentVideoInfo) {
    console.log("getCurrentVideoInfo", getCurrentVideoInfo);
    setDisplayCurrentVideoPreview(getCurrentVideoInfo?.videoUrl);
  }
 
   async function checkEnrollmentStatus() {
    try {
      // You might want to create a separate service for this check
      const response = await createEnrollmentService({
        userId: auth.user._id,
        courseId: studentViewCourseDetails._id,
        checkOnly: true // Add this flag to your backend to just check status
      });
      
      setIsAlreadyEnrolled(response?.message === "You are already enrolled in this course");
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  }


  async function handleEnrollNow() {
    try {
      if(!auth?.user?._id){
        alert("Please login to enroll in this course");
        return;
      }

       if (isAlreadyEnrolled) {
        alert("You're already enrolled in this course!");
        return;
      }
      setIsEnrolling(true);
      const enrollmentPayload ={
         userId: auth.user._id,
      userName: auth.user.userName,
      userEmail: auth.user.userEmail,
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      orderDate: new Date(),
      }

      const response = await createEnrollmentService(enrollmentPayload);
      if (response?.message === "You are already enrolled in this course") {
          alert("You're already enrolled in this course!");
      }
     if (response?.success) {
        
          // Optionally, redirect to course details or do nothing
          sessionStorage.setItem(
            "currentEnrollmentId",
            JSON.stringify(response?.data?.enrollmentId)
          );
          window.location.href = "/student-courses";
        
      } else {
        alert("Enrollment failed: " + (response.message || "Please try again"));
      }
    } catch (error) {
      console.log("error", error);
      
    }
  }

   useEffect(() => {
    if (auth?.user?._id && studentViewCourseDetails?._id) {
      checkEnrollmentStatus();
    }
  }, [auth, studentViewCourseDetails]);


  useEffect(() => {
    if (displayCurrentVideoPreview !== null) {
      console.log("displauCurrentVideoPreview", displayCurrentVideoPreview);
      setShowPreviewDislog(true);
    }
  }, [displayCurrentVideoPreview]);

  useEffect(() => {
    console.log("currentCourseId", currentCourseId);
    if (currentCourseId !== null) {
      fetchStudentViewCourseDetails();
    }
  }, [setCurrentCourseId]);

  useEffect(() => {
    if (id) {
      setCurrentCourseId(id);
    }
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("/course/details")) {
      setCurrentCourseId(null);
      setStudentViewCourseDetails(null);
    }
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  const getIndexOfFreePreview =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (curriculumItem) => curriculumItem?.freePreview
        )
      : -1;
  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instrocturName}</span>
          <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length > 1
              ? "Students"
              : "Student"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  ?.split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{studentViewCourseDetails?.description}</p>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }  flex items-center gap-2 mb-2`}
                    key={index}
                    onClick={curriculumItem?.freePreview ?() => handleSetPreview(curriculumItem): null}
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreview !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreview
                        ]?.videoUrl
                      : studentViewCourseDetails?.curriculum[0]?.videoUrl
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-3">
                <span className="text-xl font-bold">
                  {studentViewCourseDetails?.category}
                </span>
              </div>

              <Button 
                onClick={handleEnrollNow} 
                className="w-full"
                disabled={isEnrolling || isAlreadyEnrolled}
              >
                {isEnrolling 
                  ? "Enrolling..." 
                  : isAlreadyEnrolled 
                    ? "Already Enrolled" 
                    : "Enroll Now"}
              </Button>
              {isAlreadyEnrolled && (
                <div className="mt-2 text-sm text-red-600">
                  You are already enrolled in this course.
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog  open={showPreviewDislog}
          onOpenChange={() => {
            setShowPreviewDislog(false);
            setDisplayCurrentVideoPreview(null);
          }}>
        <DialogContent
         
        >
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoPreview}
              width="450px"
              height="200px"
            />
          </div>

          <div className="flex flex-col gap-2">
            {
              studentViewCourseDetails?.curriculum?.filter(item=>item.freePreview).map((curriculumItem, index) => (
                <li
                  className={`${
                    curriculumItem?.freePreview
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }  flex items-center gap-2 mb-2`}
                  key={index}
                  onClick={curriculumItem?.freePreview ?() => handleSetPreview(curriculumItem): null}
                >
                  {curriculumItem?.freePreview ? (
                    <PlayCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  <span>{curriculumItem?.title}</span>
                </li>
              ))
            }
          </div>
               
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetails;
