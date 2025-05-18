const mongoose = require("mongoose");


const LectureSchema = new mongoose.Schema({
    title: String,
    videoUrl: String,
    public_id: String,
    freePreview: Boolean,
})

const courseSchema = new mongoose.Schema({
    instructorId: String,
    instrocturName: String,
    date: Date,
    title: String,
    category: String,
    level: String,
    primaryLanguage: String,
    subtitle: String,
    description: String,
    image: String,
    welcomeMessage: String,
    pricing: Number,
    objectives: String,
    students : [
        {
            studentId: String,
            studentName: String,
            studentEmail: String,
        }
    ],
    curriculum: [LectureSchema],
    isPublished: Boolean
})

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;