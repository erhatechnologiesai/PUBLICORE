import { User, Role } from "../types";
import { MOCK_USERS } from "../mock/data";

const STORAGE_KEY_USER = "publicore_auth_user";
const STORAGE_KEY_TOKEN = "publicore_auth_token";
const COOKIE_NAME = "publicore_session";

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

let inMemorySession: AuthSession | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Route access evaluator matching Next.js Edge Middleware
export function canAccessRoute(role: Role, pathname: string): boolean {
  if (role === "admin") return true;
  if (pathname.startsWith("/dashboard/admin")) return false;
  if (pathname.startsWith("/dashboard/editor")) return role === "editor";
  if (pathname.startsWith("/dashboard/reviewer")) return role === "reviewer" || role === "editor";
  if (pathname.startsWith("/dashboard/production")) return role === "production";
  return true;
}

// Helper to set session cookie accessible by Next.js Edge Middleware
export function setSessionCookie(user: User, token: string) {
  inMemorySession = {
    user,
    token,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  if (!isBrowser()) return;
  try {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      institution: user.institution,
      token,
      expiresAt: inMemorySession.expiresAt,
    };
    const encoded = encodeURIComponent(JSON.stringify(payload));
    document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=604800; SameSite=Lax`;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    window.dispatchEvent(new CustomEvent("publicore_auth_change", { detail: { user } }));
  } catch (e) {
    console.error("Failed to write session cookie:", e);
  }
}

export function removeSessionCookie() {
  inMemorySession = null;
  if (!isBrowser()) return;
  try {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    window.dispatchEvent(new CustomEvent("publicore_auth_change", { detail: { user: null } }));
  } catch (e) {}
}

export function getClientSession(): AuthSession | null {
  if (inMemorySession) return inMemorySession;
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (raw && token) {
      const user = JSON.parse(raw);
      inMemorySession = { user, token, expiresAt: Date.now() + 604800000 };
      return inMemorySession;
    }
  } catch (e) {}
  return null;
}

export const authManager = {
  canAccessRoute,

  getCurrentSession(): AuthSession | null {
    return getClientSession();
  },
  async getCurrentUser(): Promise<User | null> {
    const session = getClientSession();
    if (session) return session.user;
    return null;
  },

  async login(email: string, password?: string): Promise<{ success: boolean; user: User; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check registered accounts from localStorage
    if (isBrowser()) {
      try {
        const raw = localStorage.getItem("publicore_registered_accounts");
        if (raw) {
          const registeredAccounts = JSON.parse(raw);
          const foundAccount = registeredAccounts.find(
            (acc: any) => acc.email.toLowerCase() === cleanEmail
          );
          if (foundAccount) {
            if (password && password !== foundAccount.password) {
              return { success: false, user: null as any, error: "Invalid password for this account." };
            }
            const token = `jwt_reg_${foundAccount.user.id}_${Date.now()}`;
            setSessionCookie(foundAccount.user, token);
            return { success: true, user: foundAccount.user };
          }
        }
      } catch (e) {}
    }

    // 2. Mock users fallback
    let found = MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      if (cleanEmail.includes("editor")) found = MOCK_USERS.find((u) => u.role === "editor");
      else if (cleanEmail.includes("reviewer")) found = MOCK_USERS.find((u) => u.role === "reviewer");
      else if (cleanEmail.includes("admin")) found = MOCK_USERS.find((u) => u.role === "admin");
      else if (cleanEmail.includes("production")) found = MOCK_USERS.find((u) => u.role === "production");
    }

    if (password && password !== "demo123") {
      return { success: false, user: null as any, error: "Invalid email or password" };
    }

    if (password && !found && cleanEmail.includes("nobody")) {
      return { success: false, user: null as any, error: "Invalid email or password" };
    }

    let user: User;
    if (found) {
      user = found;
    } else {
      user = {
        ...MOCK_USERS[0],
        id: `PUB-USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: cleanEmail.split("@")[0].replace(/[._]/g, " "),
        email: cleanEmail,
        role: "author",
        institution: "Independent Researcher",
      };
    }

    const token = `jwt_sim_${Date.now()}`;
    setSessionCookie(user, token);
    return { success: true, user };
  },

  async loginWithOrcid(orcidId: string = "0000-0002-1825-0097", name?: string): Promise<User> {
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/;
    if (!orcidRegex.test(orcidId)) {
      throw new Error("Invalid ORCID format: Expected 16-digit hyphenated format (e.g. 0000-0002-1825-0097)");
    }

    const user: User = {
      id: `usr-orcid-${Date.now()}`,
      name: name || "Dr. Elena Rostova",
      email: "elena.rostova@cambridge.ac.uk",
      role: "author",
      orcid: orcidId,
      institution: "University of Cambridge",
      title: "Senior Research Fellow & Principal Investigator",
      hIndex: 34,
      publicationsCount: 68,
      citationsCount: 4210,
      researchInterests: ["Multimodal Representation Learning", "Medical Diagnostic AI"],
    };
    const token = `orcid_tok_${Date.now()}`;
    setSessionCookie(user, token);
    return user;
  },

  async switchRole(role: Role): Promise<User> {
    const found = MOCK_USERS.find((u) => u.role === role);
    let user: User;
    if (found) {
      user = found;
    } else {
      const current = await this.getCurrentUser();
      user = current ? { ...current, role } : { ...MOCK_USERS[0], role };
    }
    const token = `role_switch_${Date.now()}`;
    setSessionCookie(user, token);
    return user;
  },

  async register(data: Partial<User>): Promise<{ success: boolean; user: User }> {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name || "Dr. New Scholar",
      email: data.email || "scholar@university.edu",
      role: data.role || "author",
      institution: data.institution || "International Research Foundation",
      department: data.department || "Division of Computational Science",
      orcid: data.orcid || "0000-0003-9999-1234",
      researchInterests: data.researchInterests || ["Artificial Intelligence", "Bioengineering"],
      publicationsCount: 0,
      citationsCount: 0,
      hIndex: 0,
    };
    const token = `reg_tok_${Date.now()}`;
    setSessionCookie(newUser, token);
    return { success: true, user: newUser };
  },

  async registerUser(data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
  }): Promise<{ success: boolean; user: User; error?: string }> {
    const cleanEmail = data.email.trim().toLowerCase();
    const fullName = data.middleName?.trim()
      ? `${data.firstName.trim()} ${data.middleName.trim()} ${data.lastName.trim()}`
      : `${data.firstName.trim()} ${data.lastName.trim()}`;
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const userId = `PUB-USR-${codeNum}`;

    const newUser: User = {
      id: userId,
      name: fullName,
      email: cleanEmail,
      role: "author",
      institution: "Academic Scholar",
      department: "Division of Research",
      orcid: `0000-0002-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      researchInterests: ["Scholarly Research", "Computational Sciences"],
      publicationsCount: 0,
      citationsCount: 0,
      hIndex: 0,
    };

    if (isBrowser()) {
      try {
        const raw = localStorage.getItem("publicore_registered_accounts");
        const accounts = raw ? JSON.parse(raw) : [];
        const existingIdx = accounts.findIndex((a: any) => a.email.toLowerCase() === cleanEmail);
        const record = {
          email: cleanEmail,
          password: data.password,
          securityQuestion: data.securityQuestion,
          securityAnswer: data.securityAnswer,
          user: newUser,
          createdAt: new Date().toISOString(),
        };
        if (existingIdx >= 0) {
          accounts[existingIdx] = record;
        } else {
          accounts.push(record);
        }
        localStorage.setItem("publicore_registered_accounts", JSON.stringify(accounts));
      } catch (e) {
        console.error("Failed to persist registered account:", e);
      }
    }

    return { success: true, user: newUser };
  },

  async logout(): Promise<void> {
    removeSessionCookie();
  },

  hasRoleAccess(currentRole: Role, requiredRole: Role): boolean {
    if (currentRole === "admin") return true; // Admin has universal access
    if (requiredRole === currentRole) return true;
    if (requiredRole === "author" && (currentRole === "editor" || currentRole === "reviewer")) return true;
    return false;
  },
};
