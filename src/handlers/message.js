import { getOrCreateUser, deductTokens, saveChatMessage, getChatHistory } from '../db/queries.js';
import { routeRequest, getSystemPromptForType, generateTextResponse } from '../ai/router.js';
import { generateImage } from '../ai/providers/pollinations.js';

const CREATOR_QUERIES = [
  "кто тебя создал", "кто твой создатель", "кто владелец", "кто хозяин",
  "кто разработчик", "кто сделал", "кем создан", "автор бота", "owner"
];

export async function handleUserMessage(ctx) {
  const userMessage = ctx.message?.text;
  if (!userMessage) return;

  const telegramUser = ctx.from;

  const dbUser = await getOrCreateUser(
    telegramUser.id,
    telegramUser.first_name,
    telegramUser.username,
    telegramUser.last_name
  );

  if (dbUser.isBanned) {
    await ctx.reply("🚫 Ваш аккаунт заблокирован.");
    return;
  }

  const lowerMsg = userMessage.toLowerCase();
  if (CREATOR_QUERIES.some(q => lowerMsg.includes(q))) {
    await ctx.reply(
      `🔱 *CerberAI* создан и разработан *Каином Сумраком* — талантливым создателем ИИ-решений.\n\n` +
      `По вопросам поддержки: @Ivanka58`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  if (dbUser.tokens <= 0 && !dbUser.isVip) {
    await ctx.reply(
      `❌ *Недостаточно токенов!*\n\n` +
      `Пополни баланс командой /balance 💰`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  const typingMsg = await ctx.reply("🧠 _Анализирую запрос и выбираю лучшую модель_...", { parse_mode: "Markdown" });

  try {
    const route = await routeRequest(userMessage);

    // Проверка платной модели
    if (route.paid && route.unavailable) {
      await ctx.api.deleteMessage(ctx.chat.id, typingMsg.message_id).catch(() => {});
      await ctx.reply(route.note || `💎 ${route.modelName} — платная модель. Используйте бесплатные через /models`, { parse_mode: "Markdown" });
      return;
    }

    // Проверка токенов
    if (!dbUser.isVip && dbUser.tokens < route.tokensRequired) {
      await ctx.api.deleteMessage(ctx.chat.id, typingMsg.message_id).catch(() => {});
      await ctx.reply(
        `❌ *Недостаточно токенов!*\n\n` +
        `Нужно: *${route.tokensRequired}* токенов\n` +
        `У вас: *${dbUser.tokens}* токенов\n\n` +
        `Пополни баланс: /balance`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    // Обновление статуса
    await ctx.api.editMessageText(
      ctx.chat.id,
      typingMsg.message_id,
      `⚙️ _Работает: ${route.modelName}..._`,
      { parse_mode: "Markdown" }
    ).catch(() => {});

    const history = await getChatHistory(telegramUser.id, 100);
    const historyForAI = history.map(h => ({ role: h.role, content: h.content }));

    await saveChatMessage(telegramUser.id, "user", userMessage, 0);

    let responseText = "";
    let imageUrl = null;

    // Генерация изображения
    if (route.requestType === "image" && route.api === 'pollinations-image') {
      await ctx.api.editMessageText(
        ctx.chat.id, 
        typingMsg.message_id,
        `🎨 _Генерирую изображение..._`,
        { parse_mode: "Markdown" }
      ).catch(() => {});

      const imageResult = await generateImage(userMessage, {
        width: 1024,
        height: 1024,
        enhance: true
      });

      await ctx.api.deleteMessage(ctx.chat.id, typingMsg.message_id).catch(() => {});

      if (!dbUser.isVip) {
        await deductTokens(telegramUser.id, route.tokensRequired);
      }

      if (imageResult.success) {
        await ctx.replyWithPhoto(imageResult.url, {
          caption: `🎨 *${route.modelName}*\n\n_${userMessage}_\n\n💰 Потрачено: ${route.tokensRequired} токенов`,
          parse_mode: "Markdown"
        });
        await saveChatMessage(telegramUser.id, "assistant", `[Изображение: ${userMessage}]`, route.tokensRequired);
      } else {
        await ctx.reply(
          `🎨 *${route.modelName}*\n\n❌ Ошибка генерации: ${imageResult.error}\n\nПопробуйте другой запрос.`,
          { parse_mode: "Markdown" }
        );
      }
      return;
    }

    // Текстовая генерация
    const systemPrompt = getSystemPromptForType(route.requestType, dbUser.isVip, route.provider);
    responseText = await generateTextResponse(userMessage, historyForAI, systemPrompt, route);

    // Списание токенов
    if (!dbUser.isVip) {
      const deducted = await deductTokens(telegramUser.id, route.tokensRequired);
      if (!deducted) {
        await ctx.api.deleteMessage(ctx.chat.id, typingMsg.message_id).catch(() => {});
        await ctx.reply("❌ Ошибка списания токенов.");
        return;
      }
    }

    await saveChatMessage(telegramUser.id, "assistant", responseText, route.tokensRequired);

    await ctx.api.deleteMessage(ctx.chat.id, typingMsg.message_id).catch(() => {});

    // Форматирование ответа
    const tierEmoji = { basic: "🟢", standard: "🔵", pro: "🟣", ultra: "⭐" };
    const typeEmoji = {
      text: "💬", code: "💻", image: "🎨", video: "🎬", 
      detailed: "📊", emotional: "💙"
    };

    const header = `${tierEmoji[route.complexity] || "🔵"} ${typeEmoji[route.requestType] || "💬"} *${route.modelName}* ${route.free ? '✅' : '💎'}\n\n`;
    const footer = `\n\n━━━━━━━━━━\n💰 Потрачено: ${route.tokensRequired} токенов${route.free ? ' (бесплатно)' : ''}`;

    const fullText = header + responseText + footer;

    // Отправка длинных сообщений частями
    if (fullText.length > 4000) {
      const chunks = splitIntoChunks(responseText, 3500);
      for (let i = 0; i < chunks.length; i++) {
        const isFirst = i === 0;
        const isLast = i === chunks.length - 1;
        const text = (isFirst ? header : "") + chunks[i] + (isLast ? footer : "");
        await ctx.reply(text, { parse_mode: "Markdown" }).catch(() => ctx.reply(text));
      }
    } else {
      await ctx.reply(fullText, { parse_mode: "Markdown" }).catch(() => ctx.reply(fullText));
    }

  } catch (error) {
    await ctx.api.deleteMessage(ctx.chat.id, typingMsg.message_id).catch(() => {});
    console.error("Message handler error:", error);
    await ctx.reply(
      `⚠️ Произошла ошибка при обработке запроса.\n\nПопробуй ещё раз или обратись в поддержку: @Ivanka58`
    );
  }
}

function splitIntoChunks(text, maxLen) {
  const chunks = [];
  let remaining = text;
  while (remaining.length > maxLen) {
    let splitAt = remaining.lastIndexOf("\n", maxLen);
    if (splitAt < maxLen / 2) splitAt = maxLen;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt);
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}
