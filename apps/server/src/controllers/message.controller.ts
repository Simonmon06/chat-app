import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { errorHandler } from "../utils/errrorhandler.js";
import { ConversationListItemType } from "@chat-app/validators";
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user!.id;

    let conversation = await prisma.conversation.findFirst({
      where: {
        // participants has at least 1 senderId and 1 receiverId
        AND: [
          { participants: { some: { id: senderId } } },
          { participants: { some: { id: receiverId } } },
        ],
      },
    });

    // otherwise create new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          // use connect to add send and receiver by using their unique properties
          participants: {
            connect: [{ id: senderId }, { id: receiverId }],
          },
        },
      });
    }

    // 3. create a new message, add conversion and sender id
    const newMessage = await prisma.message.create({
      data: {
        senderId: senderId,
        body: message,
        conversationId: conversation.id,
      },
      //  include if you want to see sender info when return
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profilePic: true,
          },
        },
      },
    });

    // TODO: use Socket.IO to send real time message

    res.status(201).json(newMessage);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user!.id;

    // add participants for security check, it's needed for security/
    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { id: conversationId },
          {
            participants: {
              some: { id: userId },
            },
          },
        ],
      },
    });

    if (!conversation) {
      res
        .status(404)
        .json({ error: "Conversation not found or access denied." });
      return;
    }
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        createAt: "asc",
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profilePic: true },
        },
      },
    });
    res.status(200).json(messages);
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
    console.log("userId", userId);
    const allConversations: ConversationListItemType[] =
      await prisma.conversation.findMany({
        where: {
          participants: { some: { id: userId } },
        },
        orderBy: { updateAt: "desc" },
        include: {
          participants: {
            where: { NOT: { id: userId } },
            select: {
              id: true,
              profilePic: true,
              username: true,
              fullName: true,
            },
          },
          messages: {
            orderBy: { createAt: "desc" },
            take: 1,
          },
        },
      });

    res.status(200).json(allConversations);
  } catch (err) {
    errorHandler(err, res);
  }
};
