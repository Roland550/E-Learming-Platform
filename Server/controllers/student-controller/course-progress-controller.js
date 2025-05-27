const { model } = require("mongoose");
const Course = require("../../models/Course");
const CourseProgress = require("../../models/CourseProgress");
const StudentCourse = require("../../models/StudentCourses");

// Mark current lecture as viewed
const markCurrentCourseAsView = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;
    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lectureProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lectureProgress.find(
        (item) => String(item.lectureId) === String(lectureId)
      );
      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lectureProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    // Check if all lectures are viewed or not
    const allLecturesViewed =
      progress.lectureProgress === course.curriculum.length &&
      progress.lectureProgress.every((item) => item.viewed);
    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();
      await progress.save();
    }
    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentEnrolledCourses = await StudentCourse.findOne({
      userId,
    });

    if (
      !studentEnrolledCourses ||
      !Array.isArray(studentEnrolledCourses.courses) ||
      !studentEnrolledCourses.courses.some(
        (item) => String(item.courseId) === String(courseId)
      )
    ) {
      return res.status(200).json({
        success: false,
        data: {
          isEnrolled: false,
        },
        message: "Sorry! You are not enrolled in this course",
      });
    }
    //get the current course progress
    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });
    if (
      !currentUserCourseProgress ||
      !Array.isArray(currentUserCourseProgress.lectureProgress) ||
      currentUserCourseProgress.lectureProgress.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,

          message: "Course not found",
        });
      }
      return res.status(200).json({
        success: true,

        message:
          "No progress found, you can start watching lectures for this course",
        data: {
          courseDetails: course,
          progress: [],
          isEnrolled: true,
          //   completed: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);
    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lectureProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isEnrolled: true,
      },
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//reset course progress
const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    progress.lectureProgress = [];
    progress.completed = false;
    progress.completionDate = null;
    await progress.save();
    res.status(200).json({
      success: true,
      message: "Course progress reset successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  markCurrentCourseAsView,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
};
