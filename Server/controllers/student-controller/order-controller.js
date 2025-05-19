const Order = require("../../models/Order");
const StudentCourse = require("../../models/StudentCourses");
const Course = require("../../models/Course");




const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderDate,
      orderStatus,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
    } = req.body;

    //Check if user already enrolled in the course
    const existingEnrollment = await StudentCourse.findOne({
        userId,
        courseId,
    })
    if (existingEnrollment) {
        return res.status(400).json({
            success: false,
            message: "You are already enrolled in this course",
        });
    }
    //Create a new order
    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      orderDate,
      orderStatus,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
    });

    const savedOrder = await newOrder.save();
    

    //Update the course's students list
    await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: {
          students: {
            studentId: userId,
            studentName: userName,
            studentEmail: userEmail,
          },
        },
      },
      { new: true })
    //Update the course's students 
    await StudentCourse.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            courses: {
              courseId,
              title: courseTitle,
              courseImage,
              courseInstructorId: instructorId,
              courseInstructorImage: instructorName,
              dateOfPurchase: orderDate,
            },
          },
        },
        { new: true, upsert: true }
      );
      res.status(200).json({
        success: true,
        message: "Enrolled in course successfully",
        data: {
            enrollmentId: savedOrder._id,
            courseId: courseId,
            courseTitle: courseTitle,
            courseImage: courseImage,
        }
      });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};

module.exports = { createOrder };
