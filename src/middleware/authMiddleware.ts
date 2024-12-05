import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

export const authMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
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

    const decodedToken = jwt.verify(token, jwtSecret) as { id: string };

    const user = await User.findById(decodedToken.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    // ユーザー情報をリクエストオブジェクトに追加
    (req as any).user = {
      id: user.id.toString(),
    };

    next();

  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "トークンの有効期限が切れています" });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "無効なトークンです" });
    }

    console.error(err);
    res.status(500).json({ 
      message: "認証エラー", 
      error: err instanceof Error ? err.message : "不明なエラー" 
    });
  }
};
