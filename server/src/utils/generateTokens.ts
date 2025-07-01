import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.cookie("JWT", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // prevent XSS cross site scripting
    httpOnly: true,
    // CSRF attack cross-site request forgery
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};
