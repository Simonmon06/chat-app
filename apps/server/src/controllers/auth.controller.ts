import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateTokens.js";
import { errorHandler } from "../utils/errrorhandler.js";
import { SignupFormTypes, LoginFormTypes } from "@chat-app/validators";
const RESERVED = new Set(["admin", "support", "root", "api", "me", "self"]);

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, username, nickname, password } =
      req.validatedBody as SignupFormTypes;

    if (RESERVED.has(String(username).toLowerCase())) {
      res.status(400).json({ error: "Username is reserved" });
      return;
    }

    // Parallel uniqueness checks (email & username)
    const [byEmail, byUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (byEmail) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }
    if (byUsername) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    // check passed start bcrypt password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // randomly generate avatar by username
    // https://www.dicebear.com/styles/icons/
    // encodeURIComponent: make sure username like A&B/C wont break the url
    const avatarLink = `https://api.dicebear.com/9.x/icons/svg?seed=${encodeURIComponent(
      username
    )}`;

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        nickname: nickname ?? null,
        password: hashedPassword,
        profilePic: avatarLink,
      },
      select: {
        id: true,
        email: true,
        username: true,
        nickname: true,
        profilePic: true,
      },
    });
    generateToken(newUser.id, res);
    res.status(201).json(newUser);
    return;
  } catch (err: unknown) {
    errorHandler(err, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.validatedBody as LoginFormTypes;
    const byEmail = identifier.includes("@");

    const foundUser = await prisma.user.findUnique({
      where: byEmail ? { email: identifier } : { username: identifier },
      select: {
        id: true,
        email: true,
        username: true,
        nickname: true,
        profilePic: true,
        password: true,
      },
    });
    if (!foundUser) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    generateToken(foundUser.id, res);
    const { password: _pw, ...safe } = foundUser;
    res.status(200).json(safe);
    return;
  } catch (err) {
    errorHandler(err, res);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("myJWT", {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
    });
    res.status(200).json({ message: "Logout successfully" });
    return;
  } catch (err) {
    errorHandler(err, res);
  }
};
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        nickname: true,
        username: true,
        profilePic: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
    return;
  } catch (err) {
    errorHandler(err, res);
  }
};
