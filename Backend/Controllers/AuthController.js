//The user's inputs are obtained from the req.body in the code above, and you then check the email to make sure no past registrations have been made

import User from "../Models/UserModel.js";
import { createSecretToken } from "../util/SecretToken.js";
import bcrypt from "bcryptjs";

export const Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      createdAt,
    });

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false, // set true for better security later
    });

    res
      .status(201)
      .json({
        message: "User signed up successfully",
        success: true,
        user,
      });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
