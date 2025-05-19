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
    } = rq.body;
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};

module.exports = { createOrder };
