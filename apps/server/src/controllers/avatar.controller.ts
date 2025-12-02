import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { makeAvatarUrl } from "../utils/userDefaults.js";
import { errorHandler } from "../utils/errrorhandler.js";

// Stable Google avatar fetcher: proxies user's profilePic through our domain.
export const proxyAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePic: true, username: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const primaryUrl =
      user.profilePic?.trim() || makeAvatarUrl(user.username ?? "user");
    const fallbackUrl = makeAvatarUrl(user.username ?? "user");
    const CACHE_SECONDS = 60 * 60 * 24; // 1 day

    const fetchImage = async (url: string) => {
      const response = await fetch(url, { redirect: "follow" });
      if (!response.ok) {
        throw new Error(`Avatar fetch failed: ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get("content-type") ?? "image/png";
      return { buffer, contentType };
    };

    let image;
    try {
      image = await fetchImage(primaryUrl);
    } catch (_err) {
      image = await fetchImage(fallbackUrl);
    }

    res.set("Cache-Control", `public, max-age=${CACHE_SECONDS}`);
    res.set("Content-Type", image.contentType);
    res.status(200).send(image.buffer);
  } catch (err: unknown) {
    errorHandler(err, res);
  }
};
