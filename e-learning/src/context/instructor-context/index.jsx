import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [coursLandingFormData, setCoursLandingFormData] = useState({
    courseLandingInitialFormData,
  });

  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData);
  // const [courseSettingsFormData, setCourseSettingsFormData] = useState({});
  return (
    <InstructorContext.Provider
      value={{
        coursLandingFormData,
        setCoursLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
