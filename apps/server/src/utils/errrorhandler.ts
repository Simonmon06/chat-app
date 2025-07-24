import { Response } from "express";

export const errorHandler = (err: unknown, res: Response) => {
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    console.log("Unexpected error", err);
    res.status(500).json({ error: "An unknown error occurred" });
  }
};
