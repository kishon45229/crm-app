import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = <
  Req extends Request = Request,
  Res extends Response = Response,
>(
  handler: (req: Req, res: Res, next: NextFunction) => Promise<unknown>,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req as Req, res as Res, next)).catch(next);
  };
};
