require("dotenv").config();
const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 3000;

const mongoURI = process.env.MONGODB_URL;

const authRoutes = require('./routes/auth-routes/index')
const mediaRoutes = require('./routes/instructor-routes/media-routes')
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes')
const studentViewCourseRoutes = require('./routes/student-route/course-route')
const studentOrderRoutes = require('./routes/student-route/order-routes')
const studentCoursesRoutes = require('./routes/student-route/student-course-routes')
const studentProgressCoursesRoutes = require('./routes/student-route/course-pogress-route')


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

//database connection
mongoose
  .connect(mongoURI)
  .then(() => console.log("Database connected"))
  .catch((e) => console.log(e));

//routes configuration
app.use('/auth', authRoutes)
app.use('/media', mediaRoutes)
app.use('/instructor/course', instructorCourseRoutes)
app.use('/student/course', studentViewCourseRoutes)
app.use('/student/order', studentOrderRoutes)
app.use('/student/taken-courses', studentCoursesRoutes)
app.use('/student/course-progress', studentProgressCoursesRoutes)

//handling global error
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
