import { getOrCreateUser, deductTokens, saveChatMessage, getChatHistory } from '../db/queries.js';
import { routeRequest, getSystemPromptForType, generateTextResponse, generateImageResponse } from '../ai/router.js';

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

    if (!dbUser.isVip && dbUser.tokens < route.tokensRequired) {
      await ctx.api.deleteMessage(ctx.chat.id, typingMsg.message_id).catch(() => {});
      await ctx.reply(
        `❌ *Недостаточно токенов для этого запроса!*\n\n` +
        `Нужно: *${route.tokensRequired}* токенов\n` +
        `У вас: *${dbUser.tokens}* токенов\n\n` +
        `Пополни баланс: /balance`,
        { parse_mode: "Markdown" }
      );
      return;
    }

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

    if (route.requestType === "image") {
      try {
        await ctx.api.editMessageText(
          ctx.chat.id, typingMsg.message_id,
          `🎨 _Генерирую изображение с помощью ${route.modelName}..._`,
          { parse_mode: "Markdown" }
        ).catch(() => {});

        await new Promise(r => setTimeout(r, 2000));
        
        await ctx.api.deleteMessage(ctx.chat.id, typingMsg.message_id).catch(() => {});
        
        if (!dbUser.isVip) {
          await deductTokens(telegramUser.id, route.tokensRequired);
        }

        await ctx.reply(
          `🎨 *${route.modelName}*\n\n` +
          `_Сгенерировано по запросу: "${userMessage}"_\n\n` +
          `💰 Потрачено: ${route.tokensRequired} токенов\n\n` +
          `⚠️ *В демо-режиме изображения не генерируются. Подключите API для реальной генерации.*`,
          { parse_mode: "Markdown" }
        );

        await saveChatMessage(telegramUser.id, "assistant", `[Изображение сгенерировано]`, route.tokensRequired);
        return;
      } catch (err) {
        responseText = `🎨 *${route.modelName}*\n\nОшибка генерации: ${err.message}`;
      }
    } else {
      const systemPrompt = getSystemPromptForType(route.requestType, dbUser.isVip, route.provider);
      responseText = await generateTextResponse(userMessage, historyForAI, systemPrompt, route);
    }

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

    const tierEmoji = { basic: "🟢", standard: "🔵", pro: "🟣", ultra: "⭐" };
    const typeEmoji = {
      text: "💬", code: "💻", image: "🎨", video: "🎬", short: "⚡", detailed: "📊", emotional: "💙"
    };

    const header = `${tierEmoji[route.complexity] || "🔵"} ${typeEmoji[route.requestType] || "💬"} *${route.modelName}*\n\n`;
    const footer = `\n\n━━━━━━━━━━\n💰 Потрачено: ${route.tokensRequired} токенов`;

    const fullText = header + responseText + footer;

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
