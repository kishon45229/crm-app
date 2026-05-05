import type { LoginValues, SignupValues } from "./types";

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

export async function login(values: LoginValues): Promise<unknown> {
  return postJson("/auth/login", {
    email: values.email,
    password: values.password,
  });
}

export async function signup(values: SignupValues): Promise<unknown> {
  return postJson("/auth/signup", {
    username: values.username,
    email: values.email,
    password: values.password,
  });
}
