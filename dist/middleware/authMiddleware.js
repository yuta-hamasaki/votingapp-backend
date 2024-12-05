"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const authMiddleware = async (req, res, next) => {
    try {
        // クッキーからトークンを取得
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: "認証トークンが必要です" });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT secret is not defined");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await User_model_1.default.findById(decodedToken.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "ユーザーが見つかりません" });
        }
        // ユーザー情報をリクエストオブジェクトに追加
        req.user = {
            id: user.id.toString(),
        };
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: "トークンの有効期限が切れています" });
        }
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: "無効なトークンです" });
        }
        console.error(err);
        res.status(500).json({
            message: "認証エラー",
            error: err instanceof Error ? err.message : "不明なエラー"
        });
    }
};
exports.authMiddleware = authMiddleware;
