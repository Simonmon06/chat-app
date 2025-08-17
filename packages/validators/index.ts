import { Prisma, Message, User, Role } from "@prisma/client";
import { z } from "zod";
import { MAX_MESSAGE_LEN } from "./src/constant.js";

// ==================================================================
// PRISMA PAYLOADS & TYPES (for sharing between client and server)
// ==================================================================
export const userPublicSelect = {
  id: true,
  nickname: true,
  profilePic: true,
} as const;
export const senderSelect = userPublicSelect;

const lastMessageSelect = {
  id: true,
  content: true,
  createdAt: true,
  sender: {
    select: { id: true, username: true, nickname: true, profilePic: true },
  },
} satisfies Prisma.MessageSelect;

export const conversationListItemPayload =
  Prisma.validator<Prisma.ConversationDefaultArgs>()({
    select: {
      id: true,
      isGroup: true,
      dmKey: true,
      updatedAt: true,
      participants: {
        select: {
          role: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              profilePic: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: lastMessageSelect,
      },
    },
  });

export type ConversationListItemType = Prisma.ConversationGetPayload<
  typeof conversationListItemPayload
>;

export const messagePayload = Prisma.validator<Prisma.MessageDefaultArgs>()({
  select: lastMessageSelect,
});
export type MessageType = Prisma.MessageGetPayload<typeof messagePayload>;

// ==================================================================
// ZOD SCHEMAS (for request validation)
// ==================================================================

export const loginFormSchema = z.object({
  /** support login with email or username */
  identifier: z.string().trim().min(1, "Email/Username is required"),
  password: z.string().trim().min(1, "Password is required"),
});

export const usernameRegex = /^[a-z0-9_]{3,20}$/i;

export const signupFormSchema = z
  .object({
    email: z.email("Invalid email"),
    username: z
      .string()
      .regex(usernameRegex, "length 3~20, allow letters/numbers/ and _"),
    nickname: z.string().min(1).optional(),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
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

export const ensureDmConversationSchema = z.object({
  params: z.object({
    receiverId: z.cuid("Invalid receiver ID format"),
  }),
});

export const startConversationSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Message cannot be empty").max(MAX_MESSAGE_LEN),
  }),
  params: z.object({
    receiverId: z.cuid("Invalid receiver ID format"),
  }),
});

export const addMessageToConversationSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Message cannot be empty").max(MAX_MESSAGE_LEN),
  }),
  params: z.object({
    conversationId: z.cuid("Invalid conversation ID format"),
  }),
});

export const getConversationSchema = z.object({
  params: z.object({
    conversationId: z.cuid("Invalid conversation ID"),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    /**
     * search by nickname
     * change to ""
     *   z.string().trim().transform(s => s || undefined).optional()
     */
    q: z.string().trim().optional(),

    /**
     * 分页大小：
     * - query 中原始是字符串，这里用 coerce 转为 number
     */
    limit: z.coerce.number().int().min(1).max(100).default(20),

    /**
     * 游标：
     * - 上一页最后一个用户的 id
     * - 不传表示第一页
     */
    cursor: z.string().trim().optional(),

    includeSelf: z.coerce.boolean().default(false),
  }),
});
export type ListUsersQuery = z.infer<typeof listUsersSchema>["query"];
//
export type LoginFormTypes = z.infer<typeof loginFormSchema>;
export type SignupFormTypes = z.infer<typeof signupFormSchema>;
