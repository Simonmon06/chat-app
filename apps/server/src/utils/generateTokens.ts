import jwt from "jsonwebtoken";
import { Response } from "express";
import { config } from "../config.js";
export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: "30d",
  });

  res.cookie("myJWT", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // prevent XSS cross site scripting
    httpOnly: true,
    // CSRF attack cross-site request forgery
    sameSite: "strict",
    secure: config.nodeEnv !== "development",
  });
};
