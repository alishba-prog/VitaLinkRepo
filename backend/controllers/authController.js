const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");



// Function to send NEW PASSWORD directly
const sendNewPasswordEmail = async (email, newPassword) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"VitaLink Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Password Has Been Reset",
    html: `
      <p>Hello,</p>
      <p>Your password has been reset successfully.</p>
      <p><b>New Password:</b> ${newPassword}</p>
      <p>Please log in with this password and change it immediately in your profile settings.</p>
    `,
  });
};



// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// FORGOT PASSWORD (Now sends NEW PASSWORD instead of link)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No account found with this email" });

    // Generate secure random password
    const newPassword = crypto.randomBytes(6).toString("hex");
    user.password = await bcrypt.hash(newPassword, 10);

    // Optional: clear resetToken fields if they exist
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();
    await sendNewPasswordEmail(email, newPassword);

    res.json({ message: "A new password has been sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server error here", error: err.message });
  }
};

