const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    // email: { type: String, required: true, unique: true },
    //c
    email: { type: String, unique: true, sparse: true }, // ✅ remove required
    phone: { type: String, unique: true, sparse: true }, 

    
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
