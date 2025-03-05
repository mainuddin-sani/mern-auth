import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verifyOtp: {
    type: String,
    default: "",
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
  resetPasswordTokenExpireAt: {
    type: Number,
    default: 0,
  },
});

// Correct model definition, 'users' is the collection name automatically derived from 'User'
const userModel = mongoose.model("User", userSchema, "users");

export default userModel;
