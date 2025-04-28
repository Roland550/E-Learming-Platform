const express = require("express");
const {
  addNewCourse,
  getAllCourse,
  getCourseDetails,
  updateCourseById,
} = require("../../controllers/instructor-controller/course-controller");
const router = express.Router();


router.post("/add", addNewCourse);
router.get("/get", getAllCourse);
router.get("/get/details/:id", getCourseDetails);
router.put("/update/:id", updateCourseById);


module.exports = router;