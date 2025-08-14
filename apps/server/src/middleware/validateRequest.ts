import { NextFunction, Request, Response } from "express";
import { ZodObject, z } from "zod";

export const validateRequest =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const requestData = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    try {
      const result = await schema.safeParseAsync(requestData);

      if (!result.success) {
        res.status(400).json({ errors: z.treeifyError(result.error) });
        return;
      }
      if (result.data.body) {
        req.body = result.data.body as Request["body"];
      }

      if (result.data.query) {
        req.query = result.data.query as Request["query"];
      }

      if (result.data.params) {
        req.params = result.data.params as Request["params"];
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error during validation." });
      return;
    }
  };
