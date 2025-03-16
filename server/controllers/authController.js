import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transport from "../config/nodemailer.js";
import userModel from "../models/userModel.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: "Missing Details", success: false });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Already registered", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL, // Properly formatted sender
      to: email,
      subject: "Welcome to Sani IT",
      text: `Welcome, ${name}! Your email: ${email}`,
    };
    console.log("Sending email to:", email);
    console.log("SMTP User:", process.env.SMTP_USER);
    console.log("SMTP Pass Loaded:", process.env.SMTP_PASS ? "Yes" : "No");
    console.log("mailOptions", mailOptions);
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent successfully:", info);
      }
    });

    return res.json({ message: "Registered successfully", success: true });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message: "Missing Details", success: false });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return res.json({ message: "Logged in successfully", success: true });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Logged out successfully", success: true });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};
