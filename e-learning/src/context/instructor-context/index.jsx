import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);

  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData);

   const [mediaUploadProgress, setMediaUploadProgress] = useState(false);

   const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);
  // const [courseSettingsFormData, setCourseSettingsFormData] = useState({});
  const [instructorCourseList, setInstructorCourseList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);
  // const [instructorCourseDetails, setInstructorCourseDetails] = useState({});
  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCourseList,
        setInstructorCourseList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
