import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../errors/httpError";

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: string;
  };
};

const getSubject = (payload: string | JwtPayload): string | null => {
  if (typeof payload === "string") return null;
  return typeof payload.sub === "string" ? payload.sub : null;
};

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const header = req.header("authorization");
  if (!header) {
    next(
      new HttpError(401, "Missing Authorization header", { code: "NO_AUTH" }),
    );
    return;
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    next(
      new HttpError(401, "Invalid Authorization header", { code: "BAD_AUTH" }),
    );
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const userId = getSubject(decoded);
    if (!userId) {
      next(new HttpError(401, "Invalid access token", { code: "BAD_TOKEN" }));
      return;
    }

    (req as AuthenticatedRequest).auth = { userId };
    next();
  } catch {
    next(new HttpError(401, "Invalid access token", { code: "BAD_TOKEN" }));
  }
};
