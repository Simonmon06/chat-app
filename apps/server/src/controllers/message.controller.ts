import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { errorHandler } from "../utils/errrorhandler.js";
import { ConversationListItemType } from "@chat-app/validators";
import { dmKeyOf } from "../utils/dmKey.js";
const senderSelect = {
  id: true,
  username: true,
  nickname: true,
  profilePic: true,
};

export const ensureDmConversation = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.validatedParams!;
    const userId = req.user!.id;
    const dmKey = dmKeyOf(userId, receiverId);

    // 先查有没有
    let conv = await prisma.conversation.findUnique({ where: { dmKey } });
    let created = false;

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          isGroup: false,
          dmKey,
          participants: {
            create: [
              { userId },
              ...(userId === receiverId ? [] : [{ userId: receiverId }]),
            ],
          },
        },
      });
      created = true;
    }

    const item = await prisma.conversation.findUnique({
      where: { id: conv!.id },
      select: {
        id: true,
        isGroup: true,
        updatedAt: true,
        participants: {
          where: { NOT: { userId } },
          select: {
            role: true,
            joinedAt: true,
            user: { select: senderSelect },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { sender: { select: senderSelect } },
        },
      },
    });

    return res.status(created ? 201 : 200).json(item);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const startConversation = async (req: Request, res: Response) => {
  try {
    const { content } = req.validatedBody;
    const { receiverId } = req.validatedParams!;
    const senderId = req.user!.id;
    const dmKey = dmKeyOf(senderId, receiverId);
    const conversation = await prisma.conversation.upsert({
      where: { dmKey },
      update: {},
      create: {
        isGroup: false,
        dmKey,
        participants: {
          create: [
            { userId: senderId },
            ...(senderId === receiverId ? [] : [{ userId: receiverId }]),
          ],
        },
      },
    });

    const [newMessage] = await prisma.$transaction([
      prisma.message.create({
        data: { senderId, conversationId: conversation.id, content },
        include: {
          sender: {
            select: senderSelect,
          },
        },
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      }),
    ]);

    return res.status(201).json(newMessage);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const addMessageToConversation = async (req: Request, res: Response) => {
  try {
    const { content } = req.validatedBody;
    const { conversationId } = req.validatedParams!;

    const senderId = req.user!.id;

    const member = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
    });
    if (!member) {
      return res
        .status(403)
        .json({ error: "Conversation not found or access denied." });
    }

    const [newMessage] = await prisma.$transaction([
      prisma.message.create({
        data: { senderId, conversationId, content },
        include: { sender: { select: senderSelect } },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return res.status(201).json(newMessage);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.validatedParams!;
    const userId = req.user!.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [{ id: conversationId }, { participants: { some: { userId } } }],
      },
      select: { id: true },
    });

    if (!conversation) {
      return res
        .status(404)
        .json({ error: "Conversation not found or access denied." });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: senderSelect } },
    });

    return res.status(200).json(messages);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const getAllSidebarConversations = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const allConversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        isGroup: true,
        dmKey: true,
        updatedAt: true,
        participants: {
          where: { NOT: { userId } },
          select: {
            role: true,
            joinedAt: true,
            user: { select: senderSelect },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { sender: { select: senderSelect } },
        },
      },
    });

    return res.status(200).json(allConversations);
  } catch (err) {
    errorHandler(err, res);
  }
};
