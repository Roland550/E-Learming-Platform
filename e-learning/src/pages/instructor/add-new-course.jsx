import CourseCurriculum from "@/components/instructor-view/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { addNewCourseService } from "@/service";
import { TabsContent } from "@radix-ui/react-tabs";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

function AddNewCoursePage() {
  const {
    coursLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();


  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in coursLandingFormData) {
      if (isEmpty(coursLandingFormData[key])) {
        return false;
      }
    }
    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) {
        hasFreePreview = true; // Assuming you have a way to check if the item is a free preview
      }
    }
    return hasFreePreview; // Ensure at least one item is a free preview
  }

  async function handleCreateCourse() {
    const CourseFinalFormData = {
      instructorId: auth?.user?._id,
      instrocturName: auth?.user?.userName,
      date: new Date(),
      ...coursLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: Boolean,
    };
    const response = await addNewCourseService(CourseFinalFormData);
    if (response?.success) {
      if (typeof setCourseLandingFormData === "function") {
        setCourseLandingFormData(courseLandingInitialFormData);
      } else {
        console.error("setCourseLandingFormData is not a function");
      }
      if (typeof setCourseCurriculumFormData === "function") {
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
      } else {
        console.error("setCourseCurriculumFormData is not a function");
      }
      navigate(-1);
    }
    console.log(CourseFinalFormData, "CourseFinalFormData");
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          disabled={validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          Submit
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
