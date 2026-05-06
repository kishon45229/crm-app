import type { Request, Response } from "express";
import { env } from "../config/env";
import { authService } from "../services/auth.service";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  signupSchema,
} from "../schemas/auth.schema";
import { HttpError } from "../errors/httpError";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const getRefreshTokenFromRequest = (req: Request): string | null => {
  const fromCookie = req.cookies?.[env.JWT_REFRESH_COOKIE_NAME] as unknown as
    | string
    | undefined;
  if (typeof fromCookie === "string" && fromCookie.length > 0)
    return fromCookie;
  const fromBody = req.body?.refreshToken as unknown as string | undefined;
  if (typeof fromBody === "string" && fromBody.length > 0) return fromBody;
  return null;
};

const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(env.JWT_REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/v1",
  });
};

const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(env.JWT_REFRESH_COOKIE_NAME, { path: "/v1" });
};

export const authController = {
  async signup(req: Request, res: Response) {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const result = await authService.signup(parsed.data);
    setRefreshCookie(res, result.refreshToken);

    res
      .status(201)
      .json({ user: result.user, accessToken: result.accessToken });
  },

  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const result = await authService.login(parsed.data);
    setRefreshCookie(res, result.refreshToken);

    res
      .status(200)
      .json({ user: result.user, accessToken: result.accessToken });
  },

  async refresh(req: Request, res: Response) {
    const parsed = refreshSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const refreshToken = getRefreshTokenFromRequest(req);
    if (!refreshToken) {
      throw new HttpError(401, "Missing refresh token", {
        code: "NO_REFRESH_TOKEN",
      });
    }

    const result = await authService.refresh({ refreshToken });
    setRefreshCookie(res, result.refreshToken);

    res
      .status(200)
      .json({ user: result.user, accessToken: result.accessToken });
  },

  async logout(req: Request, res: Response) {
    const parsed = logoutSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const refreshToken = getRefreshTokenFromRequest(req);
    if (!refreshToken) {
      throw new HttpError(401, "Missing refresh token", {
        code: "NO_REFRESH_TOKEN",
      });
    }

    await authService.logout({ refreshToken });
    clearRefreshCookie(res);
    res.status(200).json({ ok: true });
  },

  async me(req: Request, res: Response) {
    const userId = (req as AuthenticatedRequest).auth?.userId;
    if (!userId) {
      throw new HttpError(401, "Unauthorized", { code: "NO_AUTH" });
    }

    const result = await authService.getMe(userId);
    res.status(200).json(result);
  },
};
