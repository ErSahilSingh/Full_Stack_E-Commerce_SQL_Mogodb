const USER_STORAGE_KEY = "user";

export const authChangedEvent = "auth-changed";

export function pingAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(authChangedEvent));
  }
}

export type StoredUser = {
  id: number;
  name: string;
  email: string;
};

export const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: StoredUser) => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const decodeJwtPayload = (token: string): { email?: string } | null => {
  try {
    const part = token.split(".")[1];
    if (!part) {
      return null;
    }
    let b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) {
      b64 += "=";
    }
    const json = atob(b64);
    return JSON.parse(json) as { email?: string };
  } catch {
    return null;
  }
};

export const resolveDisplayUser = (): StoredUser | null => {
  const stored = getStoredUser();
  if (stored) {
    return stored;
  }
  if (typeof window === "undefined") {
    return null;
  }
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const payload = decodeJwtPayload(token);
  const email = payload?.email;
  if (email) {
    return {
      id: 0,
      name: email.split("@")[0] || email,
      email,
    };
  }
  return null;
};
