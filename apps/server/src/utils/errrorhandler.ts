import { Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import z from "zod";

const isProd = process.env.NODE_ENV === "production";

type ErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export const errorHandler = (err: unknown, res: Response) => {
  if (res.headersSent) return;

  // Prisma errors: https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint failed
        return res.status(409).json(<ErrorBody>{
          error: {
            code: "UNIQUE_CONSTRAINT",
            message: "Duplicate value",
            details: err.meta?.target,
          },
        });
      case "P2025": // Record not found
        return res.status(404).json(<ErrorBody>{
          error: { code: "NOT_FOUND", message: "Record not found" },
        });
      case "P2003": // Foreign key fails
        return res.status(409).json(<ErrorBody>{
          error: { code: "FK_CONSTRAINT", message: "Related resource missing" },
        });
      default:
        return res.status(500).json(<ErrorBody>{
          error: {
            code: `PRISMA_${err.code}`,
            message: isProd ? "Internal error" : err.message,
          },
        });
    }
  }
  // ZodError
  if (err instanceof ZodError) {
    return res.status(400).json(<ErrorBody>{
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: z.treeifyError(err),
      },
    });
  }

  // Body is not a valid JSON
  if (err instanceof SyntaxError) {
    return res.status(400).json(<ErrorBody>{
      error: { code: "BAD_JSON", message: "Malformed JSON body" },
    });
  }

  // other error
  if (err instanceof Error) {
    if (!isProd) console.error(err);
    return res.status(500).json(<ErrorBody>{
      error: {
        code: "INTERNAL_ERROR",
        message: isProd ? "Internal error" : err.message,
      },
    });
  }

  // UNKNOWN
  console.error("Unexpected error:", err);
  return res.status(500).json(<ErrorBody>{
    error: { code: "UNKNOWN", message: "An unknown error occurred" },
  });
};
