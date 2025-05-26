const StudentCourse = require("../../models/StudentCourses");


const getCoursesByStudentId = async(req, res) =>{
    try {

        const { studentId } = req.params;
        const studentCourses = await StudentCourse.findOne({ userId: studentId });
         if (!studentCourses || !Array.isArray(studentCourses.courses) || studentCourses.courses.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No courses found for this student.",
                data: [],
            });
        }
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data:studentCourses ? studentCourses?.courses : [],
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getting courses",
        })
        
    }
}

module.exports = {
    getCoursesByStudentId,
}