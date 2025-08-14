import jwt from "jsonwebtoken";
import { Response } from "express";
import { config } from "../config.js";
export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProd = config.NODE_ENV === "production";

  const sameSite = process.env.COOKIE_SAMESITE as
    | "lax"
    | "strict"
    | "none"
    | undefined;

  res.cookie("myJWT", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // prevent XSS cross site scripting
    httpOnly: true,
    // CSRF attack cross-site request forgery
    sameSite: sameSite ?? "lax",
    secure: isProd || sameSite === "none",
    path: "/",
  });
};
