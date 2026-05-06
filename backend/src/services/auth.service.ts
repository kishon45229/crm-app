import bcrypt from "bcryptjs";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../db/prisma";
import { HttpError } from "../errors/httpError";

type PublicUser = {
  id: string;
  email: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
};

const toPublicUser = (user: {
  id: string;
  email: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}): PublicUser => ({
  id: user.id,
  email: user.email,
  userName: user.userName,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const signAccessToken = (userId: string): string => {
  const options: SignOptions = {
    subject: userId,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign({}, env.JWT_ACCESS_SECRET, options);
};

const signRefreshToken = (userId: string, tokenVersion: number): string => {
  const options: SignOptions = {
    subject: userId,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign({ tokenVersion }, env.JWT_REFRESH_SECRET, options);
};

const getSubject = (payload: string | JwtPayload): string | null => {
  if (typeof payload === "string") return null;
  return typeof payload.sub === "string" ? payload.sub : null;
};

export const authService = {
  async signup(input: {
    email: string;
    password: string;
    userName?: string;
    name?: string;
  }) {
    const email = input.email.toLowerCase();

    const userName = (input.userName ?? input.name)?.trim();
    if (!userName) {
      throw new HttpError(400, "Missing username", {
        code: "MISSING_USERNAME",
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new HttpError(409, "Email already in use", {
        code: "EMAIL_IN_USE",
      });
    }

    const existingUserName = await prisma.user.findUnique({
      where: { userName },
    });
    if (existingUserName) {
      throw new HttpError(409, "Username already in use", {
        code: "USERNAME_IN_USE",
      });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        userName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        tokenVersion: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id, user.tokenVersion);

    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async login(input: { email: string; password: string }) {
    const email = input.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpError(401, "Invalid credentials", {
        code: "INVALID_LOGIN",
      });
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, "Invalid credentials", {
        code: "INVALID_LOGIN",
      });
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id, user.tokenVersion);

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    };
  },

  async refresh(input: { refreshToken: string }) {
    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(input.refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      throw new HttpError(401, "Invalid refresh token", {
        code: "INVALID_REFRESH",
      });
    }

    const userId = getSubject(decoded);
    if (!userId) {
      throw new HttpError(401, "Invalid refresh token", {
        code: "INVALID_REFRESH",
      });
    }

    const tokenVersion =
      typeof decoded !== "string" && typeof decoded.tokenVersion === "number"
        ? decoded.tokenVersion
        : null;

    if (tokenVersion === null) {
      throw new HttpError(401, "Invalid refresh token", {
        code: "INVALID_REFRESH",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        tokenVersion: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || user.tokenVersion !== tokenVersion) {
      throw new HttpError(401, "Invalid refresh token", {
        code: "INVALID_REFRESH",
      });
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id, user.tokenVersion);

    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async logout(input: { refreshToken: string }) {
    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(input.refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      throw new HttpError(401, "Invalid refresh token", {
        code: "INVALID_REFRESH",
      });
    }

    const userId = getSubject(decoded);
    if (!userId) {
      throw new HttpError(401, "Invalid refresh token", {
        code: "INVALID_REFRESH",
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });

    return { ok: true };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new HttpError(404, "User not found", { code: "USER_NOT_FOUND" });
    }

    return { user: toPublicUser(user) };
  },
};
