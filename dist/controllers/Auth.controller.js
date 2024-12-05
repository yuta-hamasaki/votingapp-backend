"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = __importDefault(require("../models/User.model"));
const register = async (req, res) => {
    const { email, username, password, imageNum } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const existingUser = await User_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const user = new User_model_1.default({
            email,
            username,
            password: hashedPassword,
            imageNum
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await User_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ id: user?.id }, jwtSecret, {
            expiresIn: "1d",
        });
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "Login successful" });
    }
    catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};
exports.login = login;
exports.default = {
    register: exports.register,
    login: exports.login,
};
