const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerSchema = require("../model/auth.model");

const SECRET_KEY = "mysecretkey";

const registerUser = async (req, res) => {
  try {
    const data = req.body;

    const existingUser = await registerSchema.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await registerSchema.create({
      ...data,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      data: newUser
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to register user",
      error: err.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await registerSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to login",
      error: err.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};