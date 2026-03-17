import { InlineKeyboard } from 'grammy';
import { getUser, setVip, setBan, getAllUsers, getStats } from '../db/queries.js';

export const ADMIN_IDS = [6749286679];

export function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

export async function handleStats(ctx) {
  if (!isAdmin(ctx.from.id)) {
    await ctx.reply("⛔ Нет доступа");
    return;
  }
  
  const stats = await getStats();
  
  await ctx.reply(
    `📊 *Статистика CerberAI*\n\n` +
    `👥 *Всего пользователей:* ${stats.totalUsers}\n` +
    `👑 *VIP пользователей:* ${stats.vipUsers}\n` +
    `🚫 *Забанено:* ${stats.bannedUsers}\n` +
    `⭐ *Всего потрачено звёзд:* ${stats.totalStars}\n\n` +
    `🤖 Бот работает нормально`,
    { parse_mode: "Markdown" }
  );
}

export async function handleAdminAction(ctx, action) {
  const actionNames = {
    give_vip: "дать VIP",
    take_vip: "забрать VIP",
    ban: "забанить",
    unban: "разбанить",
    broadcast: "сделать рассылку"
  };
  
  await ctx.reply(
    `Админ-панель: ${actionNames[action] || action}\n` +
    `Введите ID пользователя${action === 'broadcast' ? ' или текст сообщения' : ''}:`,
    { parse_mode: "Markdown" }
  );
}

export async function processAdminInput(ctx, text, action) {
  if (!isAdmin(ctx.from.id)) return "no_access";
  
  if (action === "broadcast") {
    return "awaiting_broadcast_confirm";
  }
  
  const targetId = parseInt(text.trim());
  if (isNaN(targetId)) {
    await ctx.reply("❌ Неверный ID");
    return "error";
  }
  
  if (action === "give_vip") {
    await setVip(targetId, true);
    await ctx.reply(`✅ VIP выдан пользователю ${targetId}`);
  } else if (action === "take_vip") {
    await setVip(targetId, false);
    await ctx.reply(`✅ VIP забран у пользователя ${targetId}`);
  } else if (action === "ban") {
    await setBan(targetId, true);
    await ctx.reply(`🚫 Пользователь ${targetId} забанен`);
  } else if (action === "unban") {
    await setBan(targetId, false);
    await ctx.reply(`✅ Пользователь ${targetId} разбанен`);
  }
  
  return "success";
}
