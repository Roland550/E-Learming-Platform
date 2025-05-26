import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContex } from "@/context/student-context";
import { fecthStudentCourseByIdService } from "@/service";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentTakenCourseList, setStudentTakenCourseList } =
    useContext(StudentContex);

    const navigate = useNavigate();

  async function fetchStudentTakenCourse() {
    const response = await fecthStudentCourseByIdService(auth?.user?._id);
    if (response?.success) {
      setStudentTakenCourseList(response?.data);
    }
    console.log(response);
  }

  useEffect(() => {
    fetchStudentTakenCourse();
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold ">Courses List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentTakenCourseList && studentTakenCourseList.length > 0 ? 
          studentTakenCourseList.map((course) => (
            <Card key={course._id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
                 <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instrocturName}
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate(`/course-progress/${course?.courseId}`)} className="flex-1">
                  <Watch className="w-4 h-4 mr-2" />
                  Start Watch
                </Button>
              </CardFooter>
            </Card>
          ))
        : (
          <h1 className="text-3xl font-bold mb-8">No Courses found</h1>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
