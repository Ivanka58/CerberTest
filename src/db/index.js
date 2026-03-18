import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('cerberai.db');
export const db = drizzle(sqlite);

// Экспортируем sqlite для прямых SQL-запросов в queries.js
export { sqlite };

// Создаём таблицы если их нет
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    tokens INTEGER DEFAULT 100,
    is_vip INTEGER DEFAULT 0,
    is_banned INTEGER DEFAULT 0,
    total_stars_spent INTEGER DEFAULT 0,
    text_token_limit INTEGER,
    image_token_limit INTEGER,
    video_token_limit INTEGER,
    last_daily_bonus TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_history(telegram_id);
`);

export { users, chatHistory } from './schema.js';
