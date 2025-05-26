const express = require("express");
const {
  getAllStudentViewCourses,
  getAllStudentViewCourseDetails,
  checkCourseEnrollendInfo
} = require("../../controllers/student-controller/course-controller");
const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", getAllStudentViewCourseDetails);
router.get("/enroll-info/:id/:studentId", checkCourseEnrollendInfo);

module.exports = router;
