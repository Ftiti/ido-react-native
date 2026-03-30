import { execute, query } from "@/app-utils/sqlite/index";
import { create } from "zustand";

/* ---------------- Types ---------------- */

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  phone: string;
  job: string;
  type: string;
  role: "punctual" | "regular" | "supervisor" | "agent";
  platform: string | null;
  active: boolean;
  last_sign_in_at: string;
  current_sign_in_at: string;
  photo_urls: {
    url: string | null;
    thumb: string | null;
  };
};

type AuthState = {
  isAuthenticated: boolean;
  role: "punctual" | "regular" | "supervisor" | "agent" | null;
  user: User | null;
  token: string | null;

  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

/* ---------------- Store ---------------- */

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  user: null,
  token: null,

  login: async (userData, token) => {
    await execute(
      `
      INSERT OR REPLACE INTO auth (id, token, user)
      VALUES (1, ?, ?)
    `,
      [token, JSON.stringify(userData)]
    );

    set({
      isAuthenticated: true,
      user: userData,
      token,
      role: userData.role,
    });
  },

  logout: async () => {
    await execute("DELETE FROM auth");

    set({
      isAuthenticated: false,
      role: null,
      user: null,
      token: null,
    });
  },

  hydrate: async () => {
    const rows = await query<{ token: string; user: string }>(
      "SELECT token, user FROM auth WHERE id = 1"
    );

    if (!rows.length) return;

    const user = JSON.parse(rows[0].user) as User;

    set({
      isAuthenticated: true,
      user,
      token: rows[0].token,
      role: user.role,
    });
  },
}));
