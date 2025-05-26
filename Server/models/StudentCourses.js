
const mongoose = require("mongoose");

const StudentCourseSchema = new mongoose.Schema({
    userId: String,
    courses: [
        {
            courseId: String,
            title: String,
            courseImage: String,
           
            courseInstructorId: String,
            instruct0rName: String,
            dateOfPurchase: Date,
            
        }
    ]
})

const StudentCourse = mongoose.model("StudentCourse", StudentCourseSchema);
module.exports = StudentCourse;