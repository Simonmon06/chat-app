import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateTokens.js";
import { errorHandler } from "../utils/errrorhandler.js";
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, fullName, password, gender } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // randomly generate avatar by username
    // https://www.dicebear.com/styles/icons/
    const avatarLink = `https://api.dicebear.com/9.x/icons/svg?seed=${username}`;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: avatarLink,
      },
    });

    if (newUser) {
      generateToken(newUser.id, res);
      res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err: unknown) {
    errorHandler(err, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const foundUser = await prisma.user.findUnique({ where: { username } });
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

    res.status(200).json({
      id: foundUser.id,
      fullName: foundUser.fullName,
      username: foundUser.username,
      profilePic: foundUser.profilePic,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("myJWT", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};
