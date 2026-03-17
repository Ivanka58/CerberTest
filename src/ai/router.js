// AI Router — сейчас ЗАГЛУШКИ, потом подключим реальные API

export async function routeRequest(userMessage) {
  // Анализируем запрос (заглушка — простая логика на ключевых словах)
  const lowerMsg = userMessage.toLowerCase();
  
  // Определяем тип
  let requestType = 'text';
  if (lowerMsg.includes('код') || lowerMsg.includes('python') || lowerMsg.includes('javascript')) {
    requestType = 'code';
  } else if (lowerMsg.includes('изображение') || lowerMsg.includes('картинк') || lowerMsg.includes('фото')) {
    requestType = 'image';
  } else if (lowerMsg.includes('видео')) {
    requestType = 'video';
  } else if (lowerMsg.includes('объясни') || lowerMsg.includes('подробно')) {
    requestType = 'detailed';
  } else if (lowerMsg.includes('привет') || lowerMsg.includes('как дела')) {
    requestType = 'emotional';
  }
  
  // Определяем сложность
  let complexity = 'standard';
  if (lowerMsg.length > 200) complexity = 'pro';
  if (lowerMsg.length > 500 || requestType === 'video') complexity = 'ultra';
  
  // Выбираем "модель" (заглушка)
  let modelName = "Gemini 2.5 Flash";
  let tokensRequired = 12;
  
  if (complexity === 'ultra') {
    modelName = "Claude Opus 4.6";
    tokensRequired = 65;
  } else if (complexity === 'pro') {
    modelName = "GPT-4o";
    tokensRequired = 22;
  } else if (requestType === 'image') {
    modelName = "DALL-E 3";
    tokensRequired = 40;
  } else if (requestType === 'code') {
    modelName = "DeepSeek Coder-V2";
    tokensRequired = 22;
  }
  
  return {
    requestType,
    complexity,
    modelName,
    tokensRequired,
    geminiModel: complexity === 'ultra' ? 'gemini-2.5-pro' : 'gemini-2.5-flash'
  };
}

export function getSystemPromptForType(requestType, isVip) {
  const vipNote = isVip ? " Пользователь VIP — обслуживай особенно качественно." : "";
  
  const prompts = {
    text: `Ты — CerberAI, мощный ИИ-ассистент. Пиши качественные, грамотные тексты на русском языке. Отвечай по существу, без лишней воды.${vipNote}`,
    code: `Ты — CerberAI, эксперт-программист. Пиши чистый, хорошо прокомментированный код. Объясняй решения кратко и по делу.${vipNote}`,
    image: `Ты — CerberAI, эксперт по генерации изображений. Объясни пользователю что ты создаёшь.${vipNote}`,
    video: `Ты — CerberAI, специалист по видеогенерации.${vipNote}`,
    short: `Ты — CerberAI. Отвечай КРАТКО и по существу. Максимум 2-3 предложения.${vipNote}`,
    detailed: `Ты — CerberAI, аналитик. Давай развёрнутые, структурированные ответы.${vipNote}`,
    emotional: `Ты — CerberAI, дружелюбный собеседник. Отвечай тепло, с пониманием. Создатель бота — Каин Сумрак.${vipNote}`
  };
  
  return prompts[requestType] || prompts.text;
}

// ЗАГЛУШКА: генерация текста (здесь будет реальный API)
export async function generateTextResponse(userMessage, history, systemPrompt, geminiModel) {
  const lowerMsg = userMessage.toLowerCase();
  
  // Специальные ответы
  if (lowerMsg.includes('кто тебя создал') || lowerMsg.includes('создатель')) {
    return `🔱 CerberAI создан и разработан Каином Сумраком — талантливым создателем ИИ-решений.\n\nПо вопросам поддержки: @Ivanka58`;
  }
  
  if (lowerMsg.includes('привет') || lowerMsg.includes('здравствуй')) {
    return `Привет! 👋 Я CerberAI, твой умный ассистент. Чем могу помочь?`;
  }
  
  if (lowerMsg.includes('код') || lowerMsg.includes('python')) {
    return `Вот пример кода:\n\n\`\`\`python\ndef hello_world():\n    print("Hello from CerberAI!")\n    return "Success"\n\nhello_world()\n\`\`\`\n\nЭтот код определяет функцию и вызывает её. Нужно что-то конкретное?`;
  }
  
  if (lowerMsg.includes('изображение') || lowerMsg.includes('картинк')) {
    return `🎨 DALL-E 3\n\nГенерирую изображение по запросу: "${userMessage}"\n\n⚠️ В текущей версии (ЗАГЛУШКА) генерация изображений недоступна. Для реальной генерации подключите API.`;
  }
  
  // Универсальный ответ
  return `Я получил ваш запрос: "${userMessage}"\n\n[ЗАГЛУШКА] Это демо-режим. Для получения реального ответа подключите API в файле src/ai/router.js\n\nВыбранная модель (симуляция): ${geminiModel}\nТип запроса: ${systemPrompt.slice(0, 50)}...`;
}

// ЗАГЛУШКА: генерация изображения
export async function generateImageResponse(prompt) {
  return {
    b64_json: null,
    mimeType: 'image/png',
    error: 'Генерация изображений недоступна в демо-режиме'
  };
}
