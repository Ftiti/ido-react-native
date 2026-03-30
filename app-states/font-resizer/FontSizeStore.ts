import * as SQLite from "expo-sqlite";
import { create } from "zustand";

const db = SQLite.openDatabaseSync("app.db");

// Run once to ensure table exists
db.execSync(`
  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`);

type FontSizeStore = {
  fontScale: number;
  hydrate: () => void;
  setFontScale: (scale: number) => void;
};

export const useFontSizeStore = create<FontSizeStore>((set) => ({
  fontScale: 1,

  hydrate: () => {
    const row = db.getFirstSync<{ value: string }>(
      `SELECT value FROM app_settings WHERE key = 'font_scale';`,
    );
    if (row) set({ fontScale: parseFloat(row.value) });
  },

  setFontScale: (scale) => {
    set({ fontScale: scale });
    db.runSync(
      `INSERT INTO app_settings (key, value) VALUES ('font_scale', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
      [String(scale)],
    );
  },
}));
