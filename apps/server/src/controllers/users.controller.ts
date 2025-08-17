import type { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { errorHandler } from "../utils/errrorhandler.js";
import {
  type ListUsersQuery,
  userPublicSelect,
  listUsersSchema,
} from "@chat-app/validators";
import { Prisma } from "@prisma/client";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { q, limit, cursor, includeSelf } =
      req.validatedQuery as unknown as ListUsersQuery;

    const me = req.user!.id;

    const where = {
      ...(includeSelf ? {} : { id: { not: me } }),
      ...(q
        ? { nickname: { contains: q, mode: Prisma.QueryMode.insensitive } }
        : {}),
    } satisfies Prisma.UserWhereInput;

    const take = limit + 1;
    const users = await prisma.user.findMany({
      where,
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: [{ nickname: "asc" }, { id: "asc" }],
      select: userPublicSelect,
    });

    let nextCursor: string | null = null;
    if (users.length > limit) {
      const last = users.pop()!;
      nextCursor = last.id;
    }

    return res
      .status(200)
      .json({ items: users, nextCursor, hasMore: !!nextCursor });
  } catch (err) {
    errorHandler(err, res);
  }
};
