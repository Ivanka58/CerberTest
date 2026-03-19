import { Bot, InlineKeyboard } from 'grammy';
import dotenv from 'dotenv';

import { handleStart } from './commands/start.js';
import { handleAbout, handleModelsCategory } from './commands/about.js';
import { handleBalance, handleBuyTokens, handleBuyPack, handleSetLimit } from './commands/balance.js';
import { handleProfile } from './commands/profile.js';
import { handleRules } from './commands/rules.js';
import { handleHelp } from './commands/help.js';
import { handleStats, handleVip, handleAdminAction, processAdminInput, isAdmin, sendBroadcast } from './commands/admin.js';
import { handleUserMessage } from './handlers/message.js';
import { handlePreCheckout, handleSuccessfulPayment } from './handlers/payment.js';

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN не найден в .env");
  process.exit(1);
}

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const adminState = new Map();

await bot.api.setMyCommands([
  { command: "start", description: "🚀 Запустить бота" },
  { command: "about", description: "🤖 О боте и нейросетях" },
  { command: "balance", description: "💰 Баланс токенов" },
  { command: "profile", description: "👤 Мой профиль" },
  { command: "rules", description: "📋 Правила" },
  { command: "help", description: "❓ Помощь" },
]);

bot.command("start", handleStart);
bot.command("about", handleAbout);
bot.command("balance", handleBalance);
bot.command("profile", handleProfile);
bot.command("rules", handleRules);
bot.command("help", handleHelp);
bot.command("stats", handleStats);
bot.command("vip", handleVip);

bot.callbackQuery("start", async (ctx) => { 
  await handleStart(ctx); 
  await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("about", async (ctx) => { 
  await handleAbout(ctx); 
  await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("balance", async (ctx) => { 
  await handleBalance(ctx); 
  await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("profile", async (ctx) => { 
  await handleProfile(ctx); 
  await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("rules", async (ctx) => { 
  await handleRules(ctx); 
  await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("help", async (ctx) => { 
  await handleHelp(ctx); 
  await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("ask_ai", async (ctx) => {
  await ctx.reply("💬 Напиши свой запрос, и я сразу начну работать!");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("buy_tokens", async (ctx) => { 
  await handleBuyTokens(ctx); 
  await ctx.answerCallbackQuery(); 
});

bot.callbackQuery(/^buy_pack_(.+)$/, async (ctx) => {
  const packId = ctx.match[1];
  await handleBuyPack(ctx, packId);
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("set_limit", async (ctx) => {
  await handleSetLimit(ctx);
  await ctx.answerCallbackQuery();
});

bot.callbackQuery(/^models_(\d+)$/, async (ctx) => {
  const idx = parseInt(ctx.match[1]);
  await handleModelsCategory(ctx, idx);
});

bot.callbackQuery(/^admin:(.+)$/, async (ctx) => {
  const action = ctx.match[1];
  
  if (action === "confirm_broadcast") {
    const state = adminState.get(ctx.from.id);
    if (state?.pendingBroadcast) {
      await ctx.reply("⏳ Начинаю рассылку...");
      
      const result = await sendBroadcast(bot, state.pendingBroadcast);
      
      await ctx.reply(
        `✅ Рассылка завершена!\n\n` +
        `📨 Отправлено: ${result.sentCount}\n` +
        `❌ Не удалось: ${result.failedCount}\n` +
        `👥 Всего пользователей: ${result.total}`
      );
      
      adminState.delete(ctx.from.id);
    } else {
      await ctx.reply("❌ Нет сообщения для рассылки");
    }
    await ctx.answerCallbackQuery();
    return;
  }

  if (action === "cancel_broadcast") {
    adminState.delete(ctx.from.id);
    await ctx.reply("❌ Рассылка отменена");
    await ctx.answerCallbackQuery();
    return;
  }

  if (action === "stats") {
    await handleStats(ctx);
    await ctx.answerCallbackQuery();
    return;
  }

  if (isAdmin(ctx.from.id)) {
    adminState.set(ctx.from.id, { action });
    await handleAdminAction(ctx, action);
  } else {
    await ctx.answerCallbackQuery("Нет доступа");
  }
});

bot.on("pre_checkout_query", handlePreCheckout);
bot.on("message:successful_payment", handleSuccessfulPayment);

bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id;

  if (isAdmin(userId)) {
    const state = adminState.get(userId);
    if (state) {
      const text = ctx.message.text;

      if (state.action === "broadcast") {
        adminState.set(userId, { ...state, pendingBroadcast: text });
        const keyboard = new InlineKeyboard()
          .text("✅ Подтвердить", "admin:confirm_broadcast")
          .text("❌ Отмена", "admin:cancel_broadcast");
        await ctx.reply(
          `📢 Предпросмотр рассылки:\n\n${text}\n\nПодтвердить отправку?`,
          { reply_markup: keyboard }
        );
        return;
      }

      const result = await processAdminInput(ctx, text, state.action, bot);
      if (result !== "awaiting_broadcast_confirm") {
        adminState.delete(userId);
      }
      return;
    }
  }

  await handleUserMessage(ctx);
});

bot.catch((err) => {
  console.error("❌ Ошибка бота:", err);
});

console.log("🔱 CerberAI Bot запускается...");
bot.start();
console.log("✅ CerberAI работает!");
