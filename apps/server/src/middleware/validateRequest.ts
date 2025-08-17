import e, { NextFunction, Request, Response } from "express";
import { ZodObject, z } from "zod";

export const validateRequest =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const requestData = {
      body: req.body ?? {},
      query: req.query ?? {},
      params: req.params ?? {},
    };

    try {
      const result = await schema.safeParseAsync(requestData);

      if (!result.success) {
        res.status(400).json({ errors: z.treeifyError(result.error) });
        return;
      }
      // if (result.data.query) {
      //   req.query = result.data.query as Request["query"];
      // }

      if (result.data.query) {
        (req as any).validatedQuery = result.data.query;
      }

      if (result.data.body) {
        (req as any).validatedBody = result.data.body;
      }

      if (result.data.params) {
        (req as any).validatedParams = result.data.params;
      }

      next();
    } catch (error) {
      console.error("validator middleware error: ", error);
      res
        .status(500)
        .json({ message: "Internal Server Error during validation." });
      return;
    }
  };
