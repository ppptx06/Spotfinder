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

export const DEMO_USERS: Record<string, AuthUser> = {
  admin: {
    id: 1,
    name: "Администратор SpotFinder",
    email: "admin@spotfinder.kz",
    userType: "ADMIN",
    isVerified: true,
    isAdmin: true,
    accessLevel: "SUPERADMIN",
  },
  student: {
    id: 2,
    name: "Ибрахим Нұрғали",
    email: "student@astanait.edu.kz",
    userType: "STUDENT",
    isVerified: true,
    isAdmin: false,
  },
  worker: {
    id: 3,
    name: "Багымжан О.",
    email: "remote@astanait.edu.kz",
    userType: "REMOTE_WORKER",
    isVerified: true,
    isAdmin: false,
  },
};

const AUTH_STORAGE_KEY = "spotfinder_auth_user";

export function getCurrentUser(): AuthUser {
  if (typeof window === "undefined") return DEMO_USERS.student;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USERS.student));
      return DEMO_USERS.student;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_USERS.student;
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USERS.student));
  }
  window.dispatchEvent(new Event("auth-changed"));
}

export function switchDemoRole(role: "admin" | "student" | "worker"): AuthUser {
  const selected = DEMO_USERS[role] || DEMO_USERS.student;
  setCurrentUser(selected);
  return selected;
}

export async function loginWithApi(
  email: string,
  pass: string
): Promise<{ user?: AuthUser; error?: string }> {
  // Direct client check for demo reliability
  if (email.toLowerCase().includes("admin")) {
    setCurrentUser(DEMO_USERS.admin);
    return { user: DEMO_USERS.admin };
  }
  setCurrentUser(DEMO_USERS.student);
  return { user: DEMO_USERS.student };
}

export async function registerWithApi(
  name: string,
  email: string,
  pass: string,
  userType: string
): Promise<{ user?: AuthUser; error?: string }> {
  const newUser: AuthUser = {
    id: Date.now(),
    name: name || "Пользователь",
    email: email || "user@spotfinder.kz",
    userType: (userType as any) || "STUDENT",
    isVerified: true,
    isAdmin: userType === "ADMIN",
    accessLevel: userType === "ADMIN" ? "SUPERADMIN" : null,
  };
  setCurrentUser(newUser);
  return { user: newUser };
}

export function logout(): void {
  setCurrentUser(DEMO_USERS.student);
}
