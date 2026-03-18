import { sqlite } from './index.js';

export async function getOrCreateUser(telegramId, firstName, username = null, lastName = null) {
  const existing = sqlite.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId);
  if (existing) {
    return { ...existing, isVip: !!existing.is_vip, isBanned: !!existing.is_banned };
  }
  
  const result = sqlite.prepare(`
    INSERT INTO users (telegram_id, username, first_name, last_name, tokens)
    VALUES (?, ?, ?, ?, 100)
  `).run(telegramId, username, firstName, lastName);
  
  return {
    id: result.lastInsertRowid,
    telegramId,
    username,
    firstName,
    lastName,
    tokens: 100,
    isVip: false,
    isBanned: false,
    totalStarsSpent: 0
  };
}

export async function getUser(telegramId) {
  const user = sqlite.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId);
  if (!user) return undefined;
  return { ...user, isVip: !!user.is_vip, isBanned: !!user.is_banned };
}

export async function deductTokens(telegramId, amount) {
  const user = await getUser(telegramId);
  if (!user) return false;
  if (user.isVip) return true;
  if (user.tokens < amount) return false;
  
  sqlite.prepare('UPDATE users SET tokens = tokens - ? WHERE telegram_id = ?')
    .run(amount, telegramId);
  return true;
}

export async function addTokens(telegramId, amount, starsSpent = 0) {
  sqlite.prepare(`
    UPDATE users 
    SET tokens = tokens + ?, total_stars_spent = total_stars_spent + ? 
    WHERE telegram_id = ?
  `).run(amount, starsSpent, telegramId);
}

export async function setVip(telegramId, isVip) {
  sqlite.prepare('UPDATE users SET is_vip = ? WHERE telegram_id = ?').run(isVip ? 1 : 0, telegramId);
  return true;
}

export async function setBan(telegramId, isBanned) {
  sqlite.prepare('UPDATE users SET is_banned = ? WHERE telegram_id = ?').run(isBanned ? 1 : 0, telegramId);
  return true;
}

export async function setTokenLimit(telegramId, limit) {
  sqlite.prepare('UPDATE users SET token_limit = ? WHERE telegram_id = ?').run(limit, telegramId);
  return true;
}

export async function getChatHistory(telegramId, limit = 100) {
  const rows = sqlite.prepare(`
    SELECT * FROM chat_history 
    WHERE telegram_id = ? 
    ORDER BY created_at DESC 
    LIMIT ?
  `).all(telegramId, limit);
  return rows.reverse();
}

export async function saveChatMessage(telegramId, role, content, tokensUsed = 0) {
  sqlite.prepare(`
    INSERT INTO chat_history (telegram_id, role, content, tokens_used)
    VALUES (?, ?, ?, ?)
  `).run(telegramId, role, content, tokensUsed);
  
  // Оставляем только последние 100 сообщений
  const count = sqlite.prepare('SELECT COUNT(*) as count FROM chat_history WHERE telegram_id = ?').get(telegramId);
  if (count.count > 100) {
    sqlite.prepare(`
      DELETE FROM chat_history 
      WHERE id IN (
        SELECT id FROM chat_history 
        WHERE telegram_id = ? 
        ORDER BY created_at ASC 
        LIMIT ?
      )
    `).run(telegramId, count.count - 100);
  }
}

export async function getStats() {
  const totalUsers = sqlite.prepare('SELECT COUNT(*) as count FROM users').get();
  const vipUsers = sqlite.prepare('SELECT COUNT(*) as count FROM users WHERE is_vip = 1').get();
  const bannedUsers = sqlite.prepare('SELECT COUNT(*) as count FROM users WHERE is_banned = 1').get();
  const stars = sqlite.prepare('SELECT SUM(total_stars_spent) as total FROM users').get();
  
  return {
    totalUsers: totalUsers.count,
    vipUsers: vipUsers.count,
    bannedUsers: bannedUsers.count,
    totalStars: stars.total || 0
  };
}

export async function getAllUsers() {
  return sqlite.prepare('SELECT * FROM users').all();
}
