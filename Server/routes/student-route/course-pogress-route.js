

const express = require('express');
const { getCurrentCourseProgress } = require('../../controllers/student-controller/course-progress-controller');
const { model } = require('mongoose');

const router = express.Router();

router.get('/get/:userId/:courseId', getCurrentCourseProgress);


module.exports = router;