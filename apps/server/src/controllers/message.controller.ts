import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { errorHandler } from "../utils/errrorhandler.js";
import { ConversationListItemType } from "@chat-app/validators";
import { dmKeyOf } from "../utils/dmKey.js";
import { io } from "../socket/socket.js";
const senderSelect = {
  id: true,
  username: true,
  nickname: true,
  profilePic: true,
};

async function selectConversationListItem(
  conversationId: string,
  viewerId: string
) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      isGroup: true,
      updatedAt: true,
      participants: {
        where: { NOT: { userId: viewerId } },
        select: { role: true, joinedAt: true, user: { select: senderSelect } },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: { sender: { select: senderSelect } },
      },
    },
  });
}

export const ensureDmConversation = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.validatedParams!;
    const userId = req.user!.id;
    const dmKey = dmKeyOf(userId, receiverId);

    // find conv
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

    // Generate a list item each for Current User and Peer user
    const [itemForMe, itemForPeer] = await Promise.all([
      selectConversationListItem(conv.id, userId),
      userId === receiverId
        ? null
        : selectConversationListItem(conv.id, receiverId),
    ]);

    //Push upsert to both parties' user-rooms (to make the list appear)
    io.to(`user:${userId}`).emit("conversation:upsert", { item: itemForMe });
    if (itemForPeer) {
      io.to(`user:${receiverId}`).emit("conversation:upsert", {
        item: itemForPeer,
      });
    }

    // return to the sender
    return res.status(created ? 201 : 200).json(itemForMe);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const addMessageToConversation = async (req: Request, res: Response) => {
  try {
    const { content } = req.validatedBody;
    const { conversationId } = req.validatedParams!;
    const senderId = req.user!.id;

    // authZ：确认本人是会话成员
    const member = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
    });
    if (!member) {
      return res
        .status(403)
        .json({ error: "Conversation not found or access denied." });
    }

    // 写消息 + 更新会话时间
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

    // ✅ 广播到“会话房间”，所有已 join 的端（含对方、多端）都会收到
    io.to(`conversation:${conversationId}`).emit("message:new", {
      message: newMessage,
    });

    // maybe later 同时给双方的 user-room 推一个 upsert，让会话列表置顶/更新摘要
    // const participantIds = await prisma.conversationParticipant.findMany({
    //   where: { conversationId },
    //   select: { userId: true },
    // });
    // await Promise.all(
    //   participantIds.map(async ({ userId }) => {
    //     const item = await selectConversationListItem(conversationId, userId);
    //     io.to(`user:${userId}`).emit("conversation:upsert", { item });
    //   })
    // );

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
