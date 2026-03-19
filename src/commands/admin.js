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

export async function handleVip(ctx) {
  if (!isAdmin(ctx.from.id)) {
    await ctx.reply("⛔ Нет доступа");
    return;
  }
  
  const adminName = ctx.from.first_name || "Админ";
  
  const keyboard = new InlineKeyboard()
    .text("👑 Дать VIP", "admin:give_vip")
    .text("❌ Забрать VIP", "admin:take_vip")
    .row()
    .text("🚫 Забанить", "admin:ban")
    .text("✅ Разбанить", "admin:unban")
    .row()
    .text("📢 Рассылка", "admin:broadcast")
    .text("📊 Статистика", "admin:stats");
  
  await ctx.reply(
    `👋 Добро пожаловать в админ меню, *${adminName}*!\n\n` +
    `Выберите кнопку ниже:`,
    { 
      parse_mode: "Markdown",
      reply_markup: keyboard
    }
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

// Функция для рассылки всем пользователям
export async function sendBroadcast(bot, messageText) {
  const users = await getAllUsers();
  let sentCount = 0;
  let failedCount = 0;
  
  for (const user of users) {
    try {
      // Пропускаем забаненных
      if (user.is_banned) continue;
      
      await bot.api.sendMessage(user.telegram_id, messageText);
      sentCount++;
      
      // Задержка чтобы не превысить лимиты Telegram (30 сообщений/сек)
      if (sentCount % 30 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      failedCount++;
      console.error(`❌ Не удалось отправить пользователю ${user.telegram_id}:`, error.message);
    }
  }
  
  return { sentCount, failedCount, total: users.length };
}
