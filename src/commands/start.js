import { InlineKeyboard } from 'grammy';
import { getOrCreateUser } from '../db/queries.js';

export async function handleStart(ctx) {
  const user = ctx.from;
  const dbUser = await getOrCreateUser(
    user.id,
    user.first_name,
    user.username,
    user.last_name
  );
  
  if (dbUser.isBanned) {
    await ctx.reply("🚫 Ваш аккаунт заблокирован.");
    return;
  }
  
  const keyboard = new InlineKeyboard()
    .text("🤖 Спросить ИИ", "ask_ai")
    .text("💎 Баланс", "balance").row()
    .text("👤 Профиль", "profile")
    .text("ℹ️ О боте", "about").row()
    .text("📋 Правила", "rules")
    .text("❓ Помощь", "help");
  
  const isNew = !dbUser.createdAt || (Date.now() - new Date(dbUser.createdAt).getTime()) < 5000;
  const greeting = isNew ? "добро пожаловать" : "с возвращением";
  
  const vipBadge = dbUser.isVip ? "\n\n👑 *VIP-статус активен* — приоритетное обслуживание!" : "";
  
  await ctx.reply(
    `🔱 *CerberAI* — привет, ${user.first_name}! ${greeting}!\n\n` +
    `Я — умный ИИ-ассистент нового поколения. Сам анализирую твой запрос и выбираю наилучшую нейросеть из более чем *130+ моделей*.\n\n` +
    `💡 *Просто напиши что тебе нужно:*\n` +
    `• Написать текст или статью\n` +
    `• Помочь с кодом\n` +
    `• Сгенерировать изображение\n` +
    `• Ответить на любой вопрос\n` +
    `• Поговорить и поддержать\n\n` +
    `💰 На твоём счету: *${dbUser.tokens} токенов*${vipBadge}`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
}
