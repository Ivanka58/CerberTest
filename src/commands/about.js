import { InlineKeyboard } from 'grammy';
import { AI_MODELS, getModelsByCategory } from '../ai/models.js';

export async function handleAbout(ctx) {
  const categories = getModelsByCategory();
  const keyboard = new InlineKeyboard();
  
  Object.keys(categories).forEach((cat, idx) => {
    keyboard.text(cat, `models_${idx}`).row();
  });
  
  keyboard.text("🔙 Назад", "start");
  
  await ctx.reply(
    `🤖 *О CerberAI*\n\n` +
    `Я — умный ИИ-ассистент нового поколения, который сам анализирует запросы и выбирает оптимальную нейросеть.\n\n` +
    `📊 *В каталоге:* ${AI_MODELS.length} моделей\n` +
    `🏢 *Провайдеры:* OpenAI, Anthropic, Google, xAI, DeepSeek и др.\n` +
    `🎯 *Типы:* Текст, Код, Изображения, Видео\n\n` +
    `*Категории моделей:*`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
}

export async function handleModelsCategory(ctx, idx) {
  const categories = getModelsByCategory();
  const categoryName = Object.keys(categories)[idx];
  const models = categories[categoryName];
  
  if (!models) {
    await ctx.answerCallbackQuery("Категория не найдена");
    return;
  }
  
  let text = `🤖 *${categoryName}*\n\n`;
  models.forEach(m => {
    const tierEmoji = { basic: "🟢", standard: "🔵", pro: "🟣", ultra: "⭐" }[m.tier];
    text += `${tierEmoji} *${m.name}* — ${m.tokensPerRequest} токенов\n`;
    text += `_${m.description}_\n\n`;
  });
  
  const keyboard = new InlineKeyboard()
    .text("🔙 К категориям", "about")
    .text("🔙 В меню", "start");
  
  await ctx.editMessageText(text, { 
    parse_mode: "Markdown", 
    reply_markup: keyboard 
  });
  await ctx.answerCallbackQuery();
}
