import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from "../models/User.model";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, username, password, imageNum } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = new User({
      email,
      username,
      password:hashedPassword,
      imageNum
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

const passwordMatch = await user.comparePassword(password);
if (!passwordMatch) {
  res.status(401).json({ message: "Invalid credentials" });
  return;
}

    const jwtSecret = process.env.JWT_SECRET!

    const token = jwt.sign({ id: user?.id }, jwtSecret, {
      expiresIn: "1d",
    });

    res.cookie("authToken", token, {
      httpOnly: true,     
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: (err as Error).message });
  }
};

export default {
  register,
  login,
};
