const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
    try {
        const couseData = req.body;
        const newlyCreatedCourse = await Course(couseData);
        const savedCourse = await newlyCreatedCourse.save();
        if (savedCourse) {
            res.status(201).json({
                success: true,
                message: "Course created successfully",
                data: savedCourse,
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
        
    }
};
const getAllCourse = async (req, res) => {
    try {
        const courseList = await Course.find({});
        res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: courseList,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
        
    }
};
const getCourseDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const courseDetails = await Course.findById(id);
        if (courseDetails) {
            res.status(200).json({
                success: true,
                message: "Course details fetched successfully",
                data: courseDetails,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
        
    }
};
const updateCourseById = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, {new: true});
        if (updatedCourse) {
            res.status(200).json({
                success: true,
                message: "Course updated successfully",
                data: updatedCourse,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
        
    }
};

module.exports = {
    addNewCourse,
    getAllCourse,
    getCourseDetails,
    updateCourseById,
};