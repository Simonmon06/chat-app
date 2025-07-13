import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { errorHandler } from "../utils/errrorhandler.js";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
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
