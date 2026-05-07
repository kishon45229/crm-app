import type {
  LoginResponse,
  LoginValues,
  RefreshResponse,
  SignupValues,
} from "./types";

import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  setAccessToken,
} from "./token";
import { setUser } from "./user";

type JsonRecord = Record<string, unknown>;

type ApiErrorShape = {
  message?: unknown;
  error?: unknown;
};

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  return baseUrl.replace(/\/+$/, "");
}

function getErrorMessage(status: number, payload: unknown): string {
  const maybe = payload as ApiErrorShape | null;

  if (maybe && typeof maybe === "object") {
    const message =
      typeof maybe.message === "string" ? maybe.message : undefined;
    const error = typeof maybe.error === "string" ? maybe.error : undefined;
    if (message) return message;
    if (error) return error;
  }

  return `Request failed (${status}).`;
}

async function postJson<TResponse>(
  path: string,
  body: JsonRecord,
): Promise<TResponse> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const rawText = await response.text();
  const payload = rawText ? (JSON.parse(rawText) as unknown) : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(response.status, payload));
  }

  return payload as TResponse;
}

async function requestJson<TResponse>(
  path: string,
  init: RequestInit,
  options?: { auth?: boolean },
): Promise<TResponse> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

  const authEnabled = options?.auth ?? false;
  let accessToken = authEnabled ? getAccessToken() : null;

  if (authEnabled && accessToken && isAccessTokenExpired(accessToken)) {
    try {
      accessToken = await refreshAccessToken();
    } catch {
      clearAccessToken();
      accessToken = null;
    }
  }

  const headers = new Headers(init.headers);
  if (authEnabled && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });

  if (authEnabled && response.status === 401 && accessToken) {
    try {
      const refreshed = await refreshAccessToken();
      const retryHeaders = new Headers(init.headers);
      retryHeaders.set("Authorization", `Bearer ${refreshed}`);

      const retryResponse = await fetch(url, {
        ...init,
        credentials: "include",
        headers: retryHeaders,
      });

      const retryText = await retryResponse.text();
      const retryPayload = retryText
        ? (JSON.parse(retryText) as unknown)
        : null;

      if (!retryResponse.ok) {
        throw new Error(getErrorMessage(retryResponse.status, retryPayload));
      }

      return retryPayload as TResponse;
    } catch {
      clearAccessToken();
    }
  }

  const rawText = await response.text();
  const payload = rawText ? (JSON.parse(rawText) as unknown) : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(response.status, payload));
  }

  return payload as TResponse;
}

export async function refreshAccessToken(): Promise<string> {
  const response = await postJson<RefreshResponse>("/auth/refresh", {});
  setAccessToken(response.accessToken);
  return response.accessToken;
}

export async function authedGet<TResponse>(path: string): Promise<TResponse> {
  return requestJson<TResponse>(path, { method: "GET" }, { auth: true });
}

export async function authedPost<TResponse>(
  path: string,
  body: JsonRecord,
): Promise<TResponse> {
  return requestJson<TResponse>(
    path,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    { auth: true },
  );
}

export async function authedPatch<TResponse>(
  path: string,
  body: JsonRecord,
): Promise<TResponse> {
  return requestJson<TResponse>(
    path,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
    { auth: true },
  );
}

export async function authedDelete<TResponse>(path: string): Promise<TResponse> {
  return requestJson<TResponse>(path, { method: "DELETE" }, { auth: true });
}

export async function login(values: LoginValues): Promise<LoginResponse> {
  const response = await postJson<LoginResponse>("/auth/login", {
    email: values.email,
    password: values.password,
  });
  setUser(response.user);
  setAccessToken(response.accessToken);
  return response;
}

export async function signup(values: SignupValues): Promise<unknown> {
  return postJson("/auth/signup", {
    username: values.username,
    email: values.email,
    password: values.password,
  });
}
