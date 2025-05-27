const express = require("express");
const {
  getCurrentCourseProgress,
  markCurrentCourseAsView,
  resetCurrentCourseProgress,
} = require("../../controllers/student-controller/course-progress-controller");


const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/mark-lecture-view", markCurrentCourseAsView);
router.post("/reset-progress", resetCurrentCourseProgress);

module.exports = router;
