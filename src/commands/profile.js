import { getUser, getChatHistory } from '../db/queries.js';

const ADMIN_IDS = []; // Заполни свои ID здесь

export function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

export function isCreator(userId) {
  return ADMIN_IDS.length > 0 && ADMIN_IDS[0] === userId;
}

export async function handleProfile(ctx) {
  const user = ctx.from;
  const dbUser = await getUser(user.id);
  
  if (!dbUser) {
    await ctx.reply("Сначала запусти бота командой /start");
    return;
  }
  
  const history = await getChatHistory(user.id, 100);
  const messageCount = history.length;
  const userMessages = history.filter(h => h.role === "user").length;
  const tokensSpent = history.reduce((sum, h) => sum + (h.tokensUsed || 0), 0);
  
  const regDate = new Date(dbUser.createdAt).toLocaleDateString("ru-RU", {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  
  let statusBadge = "👤 Стандарт";
  if (isCreator(user.id)) {
    statusBadge = "⚜️ Создатель";
  } else if (isAdmin(user.id)) {
    statusBadge = "🛡️ Администратор";
  } else if (dbUser.isVip) {
    statusBadge = "👑 VIP";
  }
  
  const vipNote = dbUser.isVip ? "\n✨ *VIP:* Запросы бесплатны!" : "";
  const banNote = dbUser.isBanned ? "\n🚫 *Аккаунт заблокирован*" : "";
  
  const tokenInfo = dbUser.isVip
    ? "♾️ (VIP — безлимитно)"
    : `\`${dbUser.tokens}\``;
  
  const limitsText = [
    dbUser.textTokenLimit ? `💬 Текст: до ${dbUser.textTokenLimit} токенов` : null,
    dbUser.imageTokenLimit ? `🎨 Фото: до ${dbUser.imageTokenLimit} токенов` : null,
    dbUser.videoTokenLimit ? `🎬 Видео: до ${dbUser.videoTokenLimit} токенов` : null,
  ].filter(Boolean).join("\n");
  
  await ctx.reply(
    `👤 *Профиль пользователя*\n\n` +
    `🆔 *ID:* \`${user.id}\`\n` +
    `📛 *Имя:* ${dbUser.firstName}${dbUser.lastName ? " " + dbUser.lastName : ""}\n` +
    `🔗 *Username:* ${dbUser.username ? "@" + dbUser.username : "не указан"}\n` +
    `📅 *Дата регистрации:* ${regDate}\n` +
    `🏆 *Статус:* ${statusBadge}${vipNote}${banNote}\n\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `💬 *Всего сообщений:* ${messageCount}\n` +
    `📝 *Твоих запросов:* ${userMessages}\n` +
    `💰 *Баланс:* ${tokenInfo}\n` +
    `🔥 *Потрачено токенов:* ${tokensSpent}\n` +
    `⭐ *Куплено звёзд:* ${dbUser.totalStarsSpent}\n` +
    `━━━━━━━━━━━━━━━━` +
    (limitsText ? `\n\n⚙️ *Лимиты:*\n${limitsText}` : "") +
    `\n\n📊 История хранит последние 100 сообщений.`,
    { parse_mode: "Markdown" }
  );
}
