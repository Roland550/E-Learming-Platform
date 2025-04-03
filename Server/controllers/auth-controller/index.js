const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;
  // Check if the user already exists
  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User name or email already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  // Create a new user
  const newUser = new User({
    userName,
    userEmail,
    password: hashPassword,
    role,
  });

  await newUser.save();
  return res
    .status(201)
    .json({ success: true, message: "User registered successfully" });
};

const loginUser = async (req, res) => {
    const { userEmail, password } = req.body;

    const checkUser = await User.findOne({ userEmail });
    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    if (!checkUser || !isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role
    }, 'JWT_SeCRET',{expiresIn: '120m'})
    res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
            accessToken,
            user:{
                _id: checkUser._id,
                userName: checkUser.userName,
                userEmail: checkUser.userEmail,
                role: checkUser.role
            }
        }
    })

}

module.exports = { registerUser , loginUser};
