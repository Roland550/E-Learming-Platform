const Course = require("../../models/Course");


const getAllStudentViewCourses = async (req, res) => {
  try {
    const courseList  = await Course.find({});

    if (courseList.lenght === 0) {
      return res.status(404).json({ 
          success: false, 
          message: "No courses found!" ,
            data: []
      });
    }
    res.status(200).json({
        success: true, 
        message: "Courses fetched successfully!", 
        data: courseList 
    })
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ 
        success: false, 
        message: "Some error occured!" 
    });
  }
};
const getAllStudentViewCourseDetails = async (req, res) => {
  try {

    const {id} = req.params;

    const courseDetails  = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({ 
          success: false, 
          message: "No course details found!" ,
            data: []
      });
    }
    res.status(200).json({
        success: true, 
        message: "Course details fetched successfully!", 
        data: courseDetails 
    })
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ 
        success: false, 
        message: "Some error occured!" 
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getAllStudentViewCourseDetails
};
