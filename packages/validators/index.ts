import { Prisma, Gender, Message, User } from "@prisma/client";
import { z } from "zod";

// ==================================================================
// PRISMA PAYLOADS & TYPES (for sharing between client and server)
// ==================================================================

// for get all conversations
export const conversationListItemPayload =
  Prisma.validator<Prisma.ConversationDefaultArgs>()({
    include: {
      participants: {
        where: {},
        select: {
          id: true,
          fullName: true,
          profilePic: true,
          username: true,
        },
      },
      messages: {
        take: 1,
        orderBy: {
          createAt: "desc",
        },
      },
    },
  });

// define message shape which returns from api
export const messagePayload = Prisma.validator<Prisma.MessageDefaultArgs>()({
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

// generate Types from Payload
export type ConversationListItemType = Prisma.ConversationGetPayload<
  typeof conversationListItemPayload
>;

export type MessageType = Prisma.MessageGetPayload<typeof messagePayload>;

// ==================================================================
// ZOD SCHEMAS (for request validation)
// ==================================================================

export const loginFormSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const signupFormSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirmPassword: z.string(),
    gender: z.enum(Gender),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// --------------------------------------------
// schema for backend
export const loginSchema = z.object({
  body: loginFormSchema,
});

export const signupSchema = z.object({
  body: signupFormSchema,
});

export const sendMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message cannot be empty"),
  }),
  params: z.object({
    receiverId: z.cuid("Invalid receiver ID format"),
  }),
});

export const addMessageToConversationSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message cannot be empty"),
  }),
  params: z.object({
    conversationId: z.cuid("Invalid conversation ID format"),
  }),
});

export const getConversationSchema = z.object({
  params: z.object({
    conversationId: z.cuid("Invalid Conversation ID format"),
  }),
});
