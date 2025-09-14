const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//changes 
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//c


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




// FORGOT PASSWORD (Supports Email + WhatsApp)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone, via } = req.body; // ✅ frontend will send either email or phone + via

    let user;

    if (via === "whatsapp") {
      if (!phone) return res.status(400).json({ message: "Phone number required" });

      // find user by phone (you need to store phone numbers in User model)
      user = await User.findOne({ phone });
      if (!user) return res.status(400).json({ message: "No account found with this phone number" });
    } else {
      if (!email) return res.status(400).json({ message: "Email is required" });

      user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "No account found with this email" });
    }

    // Generate random 6-character password (digits + uppercase)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newPassword = "";
    for (let i = 0; i < 6; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    console.log("Generated new password:", newPassword);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    if (via === "whatsapp") {
      // ✅ Send password to WhatsApp using Twilio
      await client.messages.create({
        body: `🔑 Your new VitaLink password is: ${newPassword}\nPlease log in and change it.`,
        from: "whatsapp:+14155238886", // Twilio sandbox WhatsApp number
        to: `whatsapp:${phone}`, // user's phone number
      });

      return res.json({ message: "New password sent via WhatsApp" });
    } else {
      // ✅ Send password via email
      await sendNewPasswordEmail(email, newPassword);
      return res.json({ message: "A new password has been sent to your email" });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN (supports email OR phone)
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email OR phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !password)
      return res.status(400).json({ message: "Full name and password required" });

    if (!email && !phone)
      return res.status(400).json({ message: "Email or phone is required" });

    // Check if user already exists (email OR phone)
 
    const query = {};
if (email) query.email = email;
if (phone) query.phone = phone;
// console.log("Signup payload:", { fullName, email, phone });


const existing = await User.findOne({ $or: Object.entries(query).map(([k,v]) => ({ [k]: v })) });


    if (existing)
      return res.status(400).json({ message: "Account already exists with email or phone" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
      console.error("Signup error:", err); // 👈 will log validation errors
  res.status(500).json({ message: "Server error2", error: err.message });
  }

};
