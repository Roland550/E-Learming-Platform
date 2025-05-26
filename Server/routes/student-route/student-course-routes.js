
const express = require('express');
const { getCoursesByStudentId } = require('../../controllers/student-controller/student-courses-controller');

const router = express.Router();

// Route to get courses by student ID
router.get('/get/:studentId', getCoursesByStudentId);

module.exports = router;