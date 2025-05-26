

const mongoose = require('mongoose');

const lectureProgressSchema = new mongoose.Schema({
    lectureId: String,
    viewed: Boolean,
    dateViewed: Date,

   
});

const courseProgressSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    completed: Boolean,
    completionDate: Date,
    lectureProgress: [lectureProgressSchema],
})

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
module.exports = CourseProgress;