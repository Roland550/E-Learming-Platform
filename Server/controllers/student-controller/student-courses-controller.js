const StudentCourse = require("../../models/StudentCourses");


const getCoursesByStudentId = async(req, res) =>{
    try {

        const { studentId } = req.params;
        const studentCourses = await StudentCourse.findOne({ userId: studentId });
      
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: studentCourses.courses,
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