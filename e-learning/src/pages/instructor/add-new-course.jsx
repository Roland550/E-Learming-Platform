import CourseCurriculum from "@/components/instructor-view/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailService,
} from "@/service";
import { TabsContent } from "@radix-ui/react-tabs";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,

    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  console.log(params, "params");

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
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
      ...courseLandingFormData,
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
  }

  async function fetchCurrentCourseDetails() {
    try {
      const response = await fetchInstructorCourseDetailService(
        currentEditedCourseId
      );

      if (response?.success) {
        // Map the response data to the course landing form data
        const setCourseFormData = Object.keys(
          courseLandingInitialFormData
        ).reduce((acc, key) => {
          acc[key] = response?.data[key] || courseLandingInitialFormData[key];
          return acc;
        }, {});

        console.log("setCourseFormData:",setCourseFormData, response?.data, );

        // Update the course landing form data
        if (typeof setCourseLandingFormData === "function") {
          setCourseLandingFormData(setCourseFormData);
        }

        // Update the course curriculum form data
        if (typeof setCourseCurriculumFormData === "function") {
          setCourseCurriculumFormData(response?.data?.curriculum || []);
        }
        
      } else {
        console.error("Failed to fetch course details:", response?.message);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) {
      setCurrentEditedCourseId(params?.courseId);
    }
  }, [params?.courseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          disabled={!validateFormData()}
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
                <CourseLanding
                  formData={courseLandingFormData}
                  setFormData={setCourseLandingFormData}
                />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings
                  formData={courseLandingFormData}
                  setFormData={setCourseLandingFormData}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
