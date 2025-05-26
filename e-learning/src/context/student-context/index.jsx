import { createContext, useState } from "react";

export const StudentContex = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCourseList, setStudentViewCourseList] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [studentTakenCourseList, setStudentTakenCourseList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({});

  return (
    <StudentContex.Provider
      value={{
        studentViewCourseList,
        setStudentViewCourseList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseId,
        setCurrentCourseId,
        studentTakenCourseList,
        setStudentTakenCourseList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
      }}
    >
      {children}
    </StudentContex.Provider>
  );
}
