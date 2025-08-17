import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import prisma from "../db/prisma.js";
import { errorHandler } from "../utils/errrorhandler.js";
interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const myToken = req.cookies.myJWT;
    if (!myToken) {
      res.status(401).json({ error: "You need to login first" });
      return;
    }
    const decoded = jwt.verify(myToken, config.JWT_SECRET) as DecodedToken;
    if (!decoded) {
      res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, nickname: true, profilePic: true },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    req.user = user;

    return next();
  } catch (err: unknown) {
    errorHandler(err, res);
  }
};
