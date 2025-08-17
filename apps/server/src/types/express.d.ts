import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    Locals extends Record<string, any> = Record<string, any>
  > {
    user?: { id: string };

    validatedBody?: ReqBody;
    validatedParams?: P;
    validatedQuery?: ReqQuery;
  }
}

export {};
