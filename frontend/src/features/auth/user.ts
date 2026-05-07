const USER_STORAGE_KEY = "auth_user";

export type User = {
  id: string;
  userName: string;
  email: string;
};

export function setUser(user: User | null): void {
  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function getUser(): User | null {
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("id" in parsed) ||
      !("userName" in parsed) ||
      !("email" in parsed)
    ) {
      console.warn("Invalid user data in localStorage:", parsed);
      return null;
    }
    return {
      id: String(parsed.id),
      userName: String(parsed.userName),
      email: String(parsed.email),
    };
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
}
