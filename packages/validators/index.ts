import { z } from "zod";
import { Gender } from "@prisma/client";

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

// export const signupSchema = z
//   .object({
//     body: z.object({
//       fullName: z.string(),
//       username: z.string(),
//       password: z.string(),
//       confirmPassword: z.string(),
//       gender: z.enum(Gender),
//     }),
//   })
//   .refine((data) => data.body.password === data.body.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["body", "confirmPassword"],
//   });

export const sendMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message cannot be empty"),
  }),
  params: z.object({
    receiverId: z.cuid("Invalid receiver ID format"),
  }),
});

export const getConversationSchema = z.object({
  params: z.object({
    conversationId: z.cuid("Invalid Conversation ID format"),
  }),
});
