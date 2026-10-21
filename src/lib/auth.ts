// Authentication & Role Management for SpotFinder
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  userType: "ADMIN" | "STUDENT" | "REMOTE_WORKER" | "HIGH_SCHOOL_STUDENT";
  isVerified: boolean;
  isAdmin: boolean;
  accessLevel?: string | null;
}

const AUTH_STORAGE_KEY = "spotfinder_auth_user";

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      // Default to logged-in student for smooth first-time demo
      const defaultUser: AuthUser = {
        id: 2,
        name: "Ибрахим Нұрғали",
        email: "student@astanait.edu.kz",
        userType: "STUDENT",
        isVerified: true,
        isAdmin: false,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  // Dispatch custom event for reactive UI updates
  window.dispatchEvent(new Event("auth-changed"));
}

export async function loginWithApi(
  email: string,
  pass: string
): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Ошибка авторизации" };
    }
    setCurrentUser(data.user);
    return { user: data.user };
  } catch (err: any) {
    return { error: err.message || "Сетевая ошибка" };
  }
}

export async function registerWithApi(
  name: string,
  email: string,
  pass: string,
  userType: string
): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass, userType }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Ошибка регистрации" };
    }
    setCurrentUser(data.user);
    return { user: data.user };
  } catch (err: any) {
    return { error: err.message || "Сетевая ошибка" };
  }
}

export function logout(): void {
  setCurrentUser(null);
}
