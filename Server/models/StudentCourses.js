
const mongoose = require("mongoose");

const StudentCourseSchema = new mongoose.Schema({
    userId: String,
    courses: [
        {
            courseId: String,
            title: String,
            courseImage: String,
           
            courseInstructorId: String,
            courseInstructorImage: String,
            dateOfPurchase: Date,
            
        }
    ]
})

const StudentCourse = mongoose.model("StudentCourse", StudentCourseSchema);
module.exports = StudentCourse;