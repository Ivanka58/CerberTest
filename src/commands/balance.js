import { InlineKeyboard } from 'grammy';
import { getUser, addTokens, setTokenLimit } from '../db/queries.js';
import { getMinTokensForType, getCheapestModelForType } from '../ai/models.js';

export const TOKEN_PACKS = [
  { id: "starter", label: "🌱 Стартер", tokens: 500, stars: 50, description: "500 токенов — хватит на 50+ простых запросов" },
  { id: "standard", label: "⚡ Стандарт", tokens: 1200, stars: 100, description: "1200 токенов — идеально для регулярного использования" },
  { id: "pro", label: "🔥 Про", tokens: 3500, stars: 250, description: "3500 токенов — для активных пользователей" },
  { id: "ultimate", label: "👑 Ультимат", tokens: 8000, stars: 500, description: "8000 токенов — максимальный пак, самая выгодная цена" },
];

export async function handleBalance(ctx) {
  const user = ctx.from;
  const dbUser = await getUser(user.id);
  
  if (!dbUser) {
    await ctx.reply("Сначала запусти бота командой /start");
    return;
  }
  
  if (dbUser.isBanned) {
    await ctx.reply("🚫 Вы заблокированы.");
    return;
  }
  
  const keyboard = new InlineKeyboard()
    .text("💰 Купить токены", "buy_tokens").row()
    .text("⚙️ Установить лимит", "set_limit");
  
  const regDate = new Date(dbUser.createdAt).toLocaleDateString("ru-RU", {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  
  const vipStatus = dbUser.isVip
    ? "👑 VIP — запросы *бесплатны*!"
    : "👤 Стандарт";
  
  const limitsText = [
    dbUser.textTokenLimit ? `\n💬 Лимит текст: ${dbUser.textTokenLimit} токенов` : "",
    dbUser.imageTokenLimit ? `\n🎨 Лимит фото: ${dbUser.imageTokenLimit} токенов` : "",
    dbUser.videoTokenLimit ? `\n🎬 Лимит видео: ${dbUser.videoTokenLimit} токенов` : ""
  ].join("");
  
  await ctx.reply(
    `💳 *Баланс CerberAI*\n\n` +
    `👤 *Пользователь:* ${dbUser.firstName}${dbUser.username ? ` (@${dbUser.username})` : ""}\n` +
    `📅 *Зарегистрирован:* ${regDate}\n` +
    `🏆 *Статус:* ${vipStatus}\n\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `💰 *Токены:* \`${dbUser.tokens}\`\n` +
    `⭐ *Потрачено звёзд:* ${dbUser.totalStarsSpent}` +
    (limitsText ? `\n\n⚙️ *Активные лимиты:*${limitsText}` : "") +
    `\n━━━━━━━━━━━━━━━━\n\n` +
    `💡 Токены тратятся с каждым запросом.\n` +
    `Сложные запросы стоят больше токенов.\n` +
    `Каждый день в 00:00 МСК — *+50 токенов* бонус!\n\n` +
    `_Совет: установи лимит токенов, чтобы бот использовал только те модели, которые тебе по карману._`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
}

export async function handleBuyTokens(ctx) {
  const keyboard = new InlineKeyboard();
  
  TOKEN_PACKS.forEach(pack => {
    keyboard.text(
      `${pack.label}: ${pack.tokens} токенов за ⭐${pack.stars}`,
      `buy_pack_${pack.id}`
    ).row();
  });
  
  keyboard.text("🔙 Назад", "balance");
  
  await ctx.reply(
    `⭐ *Покупка токенов*\n\n` +
    `Оплата через Telegram Stars — безопасно и мгновенно.\n` +
    `После оплаты токены зачисляются автоматически.\n\n` +
    `*Доступные пакеты:*`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
}

export async function handleBuyPack(ctx, packId) {
  const pack = TOKEN_PACKS.find(p => p.id === packId);
  if (!pack) {
    await ctx.answerCallbackQuery("Пакет не найден");
    return;
  }
  
  // ЗАГЛУШКА: в реальности здесь был бы invoice
  await ctx.reply(
    `💳 *Оплата пакета "${pack.label}"*\n\n` +
    `В демо-режиме токены начисляются автоматически!\n` +
    `В реальности здесь была бы оплата через Telegram Stars.`,
    { parse_mode: "Markdown" }
  );
  
  await addTokens(ctx.from.id, pack.tokens, pack.stars);
  await ctx.answerCallbackQuery(`✅ +${pack.tokens} токенов!`);
}

export async function handleSetLimit(ctx) {
  const keyboard = new InlineKeyboard()
    .text("💬 Лимит на текст", "limit_text").row()
    .text("🎨 Лимит на изображения", "limit_image").row()
    .text("🎬 Лимит на видео", "limit_video").row()
    .text("🗑️ Сбросить все лимиты", "limit_reset").row()
    .text("🔙 Назад", "balance");
  
  const minText = getMinTokensForType("text");
  const minImage = getMinTokensForType("image");
  const minVideo = getMinTokensForType("video");
  
  await ctx.reply(
    `⚙️ *Установка лимита токенов*\n\n` +
    `Лимит ограничивает максимальную стоимость одного запроса.\n` +
    `Бот будет выбирать только те нейросети, которые укладываются в твой лимит.\n\n` +
    `*Минимальные цены:*\n` +
    `💬 Текст — от \`${minText}\` токенов\n` +
    `🎨 Изображения — от \`${minImage}\` токенов\n` +
    `🎬 Видео — от \`${minVideo}\` токенов\n\n` +
    `Выбери тип для настройки:`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
    }
