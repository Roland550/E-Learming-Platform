const Course = require("../../models/Course");
const StudentCourse = require("../../models/StudentCourses");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;
    let filter = {};
    if (category.length) {
      filter.category = { $in: category.split(",") };
    }
    if (level.length) {
      filter.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filter.language = { $in: primaryLanguage.split(",") };
    }
    
    let sortParm = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParm.pricing = 1;
        break;
      case "price-hightolow":
      sortParm.pricing = -1;
        break;
      case "title-ztoa":
        sortParm.title = -1;
        break;  
      case "title-atoz":
        sortParm.title = 1;
        break;
      
      default:
        sortParm.pricing = 1;
    }

    const courseList = await Course.find(filter).sort(sortParm);
    

    if (courseList.lenght === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found!",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully!",
      data: courseList,
    });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
const getAllStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found!",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Course details fetched successfully!",
      data: courseDetails,
      
    });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const checkCourseEnrollendInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const studentCourse = await StudentCourse.findOne({
      userId: studentId,
    });
       
    let ifStudentEnrolledAlreadyCourse = false;
     if (studentCourse && Array.isArray(studentCourse.courses)) {
      ifStudentEnrolledAlreadyCourse =
        studentCourse.courses.findIndex(item => item.courseId === id) > -1;
    }
     
    res.status(200).json({
      success: true,
      message: ifStudentEnrolledAlreadyCourse
        ? "You are already enrolled in this course"
        : "You are not enrolled in this course",
      data: {isEnrolled: ifStudentEnrolledAlreadyCourse},
    });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
    
  }
}

module.exports = {
  getAllStudentViewCourses,
  getAllStudentViewCourseDetails,
  checkCourseEnrollendInfo
};
