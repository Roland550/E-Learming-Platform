
import { createContext, useState } from "react";


export const StudentContex = createContext(null)


export default function StudentProvider({ children }) {

    const [studentViewCourseList, setStudentViewCourseList] = useState([])

  return (
    <StudentContex.Provider value={{studentViewCourseList, setStudentViewCourseList}}>
      {children}
    </StudentContex.Provider>
  )
}