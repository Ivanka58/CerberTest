import { askPollinationsWithFallback } from './providers/pollinations.js';

// ==================== КАТАЛОГ ВСЕХ 130+ МОДЕЛЕЙ ====================

const MODEL_CATALOG = {
  // ==================== POLLINATIONS МОДЕЛИ (БЕСПЛАТНЫЕ, РАБОТАЮТ ИЗ РФ) ====================
  'pollinations-openai': {
    name: 'GPT-4o Mini (Pollinations)',
    provider: 'Pollinations',
    type: 'chat',
    description: 'Бесплатный GPT-4o-mini через Pollinations AI. Быстрый и умный.',
    bestFor: 'Всё: ответы на вопросы, анализ, код, творчество',
    tokensCost: 5,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'openai',
    api: 'pollinations',
    free: true
  },
  'pollinations-mistral': {
    name: 'Mistral Large (Pollinations)',
    provider: 'Pollinations',
    type: 'chat',
    description: 'Бесплатный Mistral. Европейская модель, хорош для логики.',
    bestFor: 'Логика, анализ, рассуждения, европейский контекст',
    tokensCost: 8,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'mistral',
    api: 'pollinations',
    free: true
  },
  'pollinations-llama': {
    name: 'Llama 3.1 (Pollinations)',
    provider: 'Pollinations',
    type: 'chat',
    description: 'Бесплатный Llama 3.1 от Meta. Open-source лидер.',
    bestFor: 'Код, технические задачи, open-source проекты',
    tokensCost: 6,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'llama',
    api: 'pollinations',
    free: true
  },
  'pollinations-claude': {
    name: 'Claude Haiku (Pollinations)',
    provider: 'Pollinations',
    type: 'chat',
    description: 'Бесплатный Claude. Безопасный и точный.',
    bestFor: 'Безопасные ответы, анализ, структурирование',
    tokensCost: 7,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'claude',
    api: 'pollinations',
    free: true
  },
  'pollinations-deepseek': {
    name: 'DeepSeek Chat (Pollinations)',
    provider: 'Pollinations',
    type: 'chat',
    description: 'Бесплатный DeepSeek. Китайская модель, сильна в коде.',
    bestFor: 'Код, математика, логика, китайский контекст',
    tokensCost: 6,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'deepseek',
    api: 'pollinations',
    free: true
  },
  'pollinations-image': {
    name: 'Image Generation (Pollinations)',
    provider: 'Pollinations',
    type: 'image',
    description: 'Бесплатная генерация изображений. Текст в картинку.',
    bestFor: 'Арт, иллюстрации, концепт-арт, мемы',
    tokensCost: 15,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'image',
    api: 'pollinations-image',
    free: true
  },

  // ==================== OPENAI (ПЛАТНЫЕ, ДЛЯ КАТАЛОГА) ====================
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Оптимизированная версия GPT-3. Быстрая и экономичная.',
    bestFor: 'Повседневные задачи, чаты, переводы',
    tokensCost: 10,
    complexity: 'basic',
    icon: '🟢',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'gpt-4': {
    name: 'GPT-4',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Классический GPT-4. Надёжный интеллект.',
    bestFor: 'Анализ, документы, структурирование',
    tokensCost: 30,
    complexity: 'standard',
    icon: '🔵',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'gpt-4o': {
    name: 'GPT-4o',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Омни-модель. Универсальный флагман.',
    bestFor: 'Всё: от простых вопросов до сложного кода',
    tokensCost: 20,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Лёгкая версия GPT-4o. Очень дешевая.',
    bestFor: 'Быстрые ответы, рутина, большие объёмы',
    tokensCost: 6,
    complexity: 'basic',
    icon: '🟢',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'o1': {
    name: 'o1',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Reasoning модель. Думает перед ответом.',
    bestFor: 'Математика, наука, сложные задачи',
    tokensCost: 45,
    complexity: 'ultra',
    icon: '⭐',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'o3-mini': {
    name: 'o3 Mini',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Доступный o3. Отличное reasoning.',
    bestFor: 'Повседневные сложные задачи',
    tokensCost: 20,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== DEEPSEEK (ПЛАТНЫЕ, ДЛЯ КАТАЛОГА) ====================
  'deepseek-v3': {
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Флагман 2024. 671B параметров. GPT-4 уровень.',
    bestFor: 'Всё: код, текст, анализ, математика',
    tokensCost: 15,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'deepseek-r1': {
    name: 'DeepSeek-R1',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Reasoning модель. Думает как o1.',
    bestFor: 'Логика, математика, научные задачи',
    tokensCost: 18,
    complexity: 'ultra',
    icon: '⭐',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'deepseek-coder-v2': {
    name: 'DeepSeek Coder-V2',
    provider: 'DeepSeek',
    type: 'code',
    description: 'Улучшенный кодер. 300+ языков.',
    bestFor: 'Профессиональная разработка, отладка',
    tokensCost: 15,
    complexity: 'pro',
    icon: '💻',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== XAI GROK (ПЛАТНЫЕ) ====================
  'grok-2': {
    name: 'Grok-2',
    provider: 'xAI',
    type: 'chat',
    description: 'Второе поколение. Остроумный, прямолинейный.',
    bestFor: 'Общение, юмор, новости, анализ',
    tokensCost: 20,
    complexity: 'standard',
    icon: '🔵',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'grok-3': {
    name: 'Grok-3',
    provider: 'xAI',
    type: 'chat',
    description: 'Третье поколение. Самый умный Grok.',
    bestFor: 'Сложный анализ, исследования, код',
    tokensCost: 30,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== ANTHROPIC CLAUDE (ПЛАТНЫЕ) ====================
  'claude-haiku-3.5': {
    name: 'Claude Haiku 3.5',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Самый быстрый Claude. Мгновенные ответы.',
    bestFor: 'Чаты, уведомления, быстрые задачи',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'claude-sonnet-3.7': {
    name: 'Claude Sonnet 3.7',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Баланс скорости и качества. Универсальный.',
    bestFor: 'Рабочие задачи, документы, код',
    tokensCost: 20,
    complexity: 'standard',
    icon: '🔵',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'claude-opus-4': {
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Творческий гений. Лучший для сложных задач.',
    bestFor: 'Творчество, длинные тексты, исследования',
    tokensCost: 50,
    complexity: 'ultra',
    icon: '⭐',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== GOOGLE GEMINI (ПЛАТНЫЕ) ====================
  'gemini-2.5-flash': {
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    type: 'chat',
    description: 'Молниеносная. 1M контекст. Для больших объёмов.',
    bestFor: 'Суммаризация, обработка документов, скорость',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'gemini-2.5-pro': {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    type: 'chat',
    description: 'Флагман 2.5. Лучшее соотношение цена/качество.',
    bestFor: 'Всё: код, текст, анализ, планирование',
    tokensCost: 18,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== MISTRAL (ПЛАТНЫЕ) ====================
  'mistral-large-3': {
    name: 'Mistral Large 3',
    provider: 'Mistral',
    type: 'chat',
    description: 'Флагман европейского AI. 123B параметров.',
    bestFor: 'Сложные рассуждения, многоязычность, код',
    tokensCost: 22,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'mistral-small': {
    name: 'Mistral Small',
    provider: 'Mistral',
    type: 'chat',
    description: 'Быстрая и дешевая. Для рутины.',
    bestFor: 'Простые задачи, большие объёмы',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== META LLAMA (ПЛАТНЫЕ) ====================
  'llama-3-8b': {
    name: 'Llama 3 8B',
    provider: 'Meta',
    type: 'chat',
    description: 'Open-source от Meta. Компактная и быстрая.',
    bestFor: 'Быстрые задачи, чаты, простые запросы',
    tokensCost: 6,
    complexity: 'basic',
    icon: '🟢',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'llama-3-70b': {
    name: 'Llama 3 70B',
    provider: 'Meta',
    type: 'chat',
    description: 'Мощная open-source модель. GPT-4 уровень.',
    bestFor: 'Сложные задачи, код, анализ',
    tokensCost: 15,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== YANDEX (ПЛАТНЫЕ) ====================
  'yandexgpt-4-pro': {
    name: 'YandexGPT 4 Pro',
    provider: 'Yandex',
    type: 'chat',
    description: 'Русский интеллект. Отлично понимает контекст РФ.',
    bestFor: 'Русский язык, локальные задачи',
    tokensCost: 15,
    complexity: 'standard',
    icon: '🔵',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'yandexgpt-5-pro': {
    name: 'YandexGPT 5 Pro',
    provider: 'Yandex',
    type: 'chat',
    description: 'Полная версия 5.0. Максимум возможностей.',
    bestFor: 'Профессиональные задачи, enterprise',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== SBER GIGACHAT (ПЛАТНЫЕ) ====================
  'gigachat-2-max': {
    name: 'GigaChat 2 Max',
    provider: 'Sber',
    type: 'chat',
    description: 'Максимальная версия. Корпоративный уровень.',
    bestFor: 'Enterprise, сложные бизнес-задачи',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'gigachat-2-pro': {
    name: 'GigaChat 2 Pro',
    provider: 'Sber',
    type: 'chat',
    description: 'Профессиональная версия. Баланс цена/качество.',
    bestFor: 'Бизнес, документы, аналитика',
    tokensCost: 18,
    complexity: 'standard',
    icon: '🔵',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== ИЗОБРАЖЕНИЯ (ПЛАТНЫЕ) ====================
  'dall-e-3': {
    name: 'DALL-E 3',
    provider: 'OpenAI',
    type: 'image',
    description: 'Флагман. Точное следование промптам, детали.',
    bestFor: 'Профессиональные иллюстрации, концепт-арт',
    tokensCost: 40,
    complexity: 'pro',
    icon: '🎨',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'midjourney-v6': {
    name: 'Midjourney v6',
    provider: 'Midjourney',
    type: 'image',
    description: 'Шестая версия. Фотореализм, текст, детали.',
    bestFor: 'Профессиональный арт, реклама, дизайн',
    tokensCost: 50,
    complexity: 'ultra',
    icon: '🎨',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'stable-diffusion': {
    name: 'Stable Diffusion XL',
    provider: 'Stability',
    type: 'image',
    description: 'Open-source классика. Гибкая, мощная.',
    bestFor: 'Кастомизация, fine-tuning, вариации',
    tokensCost: 25,
    complexity: 'standard',
    icon: '🎨',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },
  'kandinsky-3-1': {
    name: 'Kandinsky 3.1',
    provider: 'Sber',
    type: 'image',
    description: 'Обновлённая версия. Улучшенное качество.',
    bestFor: 'Современная генерация, русские промпты',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🎨',
    modelId: null,
    api: 'none',
    free: false,
    paid: true
  },

  // ==================== ВИДЕО (НЕДОСТУПНО) ====================
  'sora-2': {
    name: 'Sora 2',
    provider: 'OpenAI',
    type: 'video',
    description: 'Текст в видео до 60 сек. Реалистичные сцены.',
    bestFor: 'Короткие ролики, превью, концепты',
    tokensCost: 200,
    complexity: 'ultra',
    icon: '🎬',
    modelId: null,
    api: 'none',
    free: false,
    paid: true,
    unavailable: true
  },
  'runway-gen-4-5': {
    name: 'Runway Gen-4.5',
    provider: 'Runway',
    type: 'video',
    description: 'Профессиональная генерация. Motion Brush.',
    bestFor: 'Motion graphics, реклама, дизайн',
    tokensCost: 180,
    complexity: 'ultra',
    icon: '🎬',
    modelId: null,
    api: 'none',
    free: false,
    paid: true,
    unavailable: true
  },
  'kling-ai': {
    name: 'Kling AI',
    provider: 'Kuaishou',
    type: 'video',
    description: '2 минуты, 1080p. Движение, физика.',
    bestFor: 'Короткометражки, реклама, демо',
    tokensCost: 160,
    complexity: 'ultra',
    icon: '🎬',
    modelId: null,
    api: 'none',
    free: false,
    paid: true,
    unavailable: true
  }
};

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

export function getModelById(modelId) {
  return MODEL_CATALOG[modelId] || MODEL_CATALOG['pollinations-openai'];
}

export function getModelsByType(type) {
  return Object.entries(MODEL_CATALOG)
    .filter(([_, model]) => model.type === type)
    .map(([id, model]) => ({ id, ...model }));
}

export function getModelsByProvider(provider) {
  return Object.entries(MODEL_CATALOG)
    .filter(([_, model]) => model.provider === provider)
    .map(([id, model]) => ({ id, ...model }));
}

export function getAllModels() {
  return Object.entries(MODEL_CATALOG).map(([id, model]) => ({ id, ...model }));
}

export function getAvailableModels() {
  return Object.entries(MODEL_CATALOG)
    .filter(([_, model]) => model.api === 'pollinations' || (!model.unavailable && !model.paid))
    .map(([id, model]) => ({ id, ...model }));
}

export function getFreeModels() {
  return Object.entries(MODEL_CATALOG)
    .filter(([_, model]) => model.free === true && model.api === 'pollinations')
    .map(([id, model]) => ({ id, ...model }));
}

// ==================== РОУТИНГ ЗАПРОСОВ (ИСПОЛЬЗУЕТ POLLINATIONS) ====================

export async function routeRequest(userMessage, preferredModel = null) {
  const lowerMsg = userMessage.toLowerCase();
  
  // Если модель выбрана вручную
  if (preferredModel && MODEL_CATALOG[preferredModel]) {
    const model = MODEL_CATALOG[preferredModel];
    
    // Если выбрана платная модель — показываем информацию
    if (model.paid && !model.free) {
      return {
        modelId: preferredModel,
        modelName: model.name,
        provider: model.provider,
        requestType: model.type,
        complexity: model.complexity,
        tokensRequired: model.tokensCost,
        description: model.description,
        icon: model.icon,
        bestFor: model.bestFor,
        unavailable: true,
        paid: true,
        free: false,
        note: `💎 ${model.name} — платная модель.\n\n✅ Используйте бесплатные альтернативы:\n• pollinations-openai (GPT-4o Mini)\n• pollinations-mistral\n• pollinations-llama\n• pollinations-deepseek\n\nКоманда: /models`
      };
    }
    
    // Если выбрана бесплатная Pollinations модель
    if (model.api === 'pollinations') {
      return {
        modelId: preferredModel,
        modelName: model.name,
        provider: model.provider,
        requestType: model.type,
        complexity: model.complexity,
        tokensRequired: model.tokensCost,
        description: model.description,
        icon: model.icon,
        bestFor: model.bestFor,
        unavailable: false,
        paid: false,
        free: true,
        api: 'pollinations',
        pollinationsModel: model.modelId
      };
    }
    
    // Недоступные модели
    return {
      modelId: preferredModel,
      modelName: model.name,
      provider: model.provider,
      requestType: model.type,
      complexity: model.complexity,
      tokensRequired: model.tokensCost,
      description: model.description,
      icon: model.icon,
      bestFor: model.bestFor,
      unavailable: true,
      paid: model.paid,
      free: false,
      note: '⚠️ Модель временно недоступна'
    };
  }
  
  // Автоопределение типа запроса
  let requestType = 'text';
  let selectedPollinationsModel = 'openai'; // По умолчанию GPT-4o Mini
  
  if (lowerMsg.includes('код') || lowerMsg.includes('python') || lowerMsg.includes('javascript') || 
      lowerMsg.includes('программ') || lowerMsg.includes('функция') || lowerMsg.includes('класс')) {
    requestType = 'code';
    selectedPollinationsModel = 'deepseek'; // DeepSeek силён в коде
  } else if (lowerMsg.includes('изображение') || lowerMsg.includes('картинк') || 
             lowerMsg.includes('фото') || lowerMsg.includes('нарисуй') || lowerMsg.includes('арт')) {
    requestType = 'image';
    selectedPollinationsModel = 'image';
  } else if (lowerMsg.includes('видео') || lowerMsg.includes('ролик') || 
             lowerMsg.includes('снять') || lowerMsg.includes('фильм')) {
    requestType = 'video';
  } else if (lowerMsg.includes('объясни подробно') || lowerMsg.includes('распиши') || 
             lowerMsg.includes('детально') || lowerMsg.includes('анализ')) {
    requestType = 'detailed';
    selectedPollinationsModel = 'mistral'; // Mistral хорош для анализа
  } else if (lowerMsg.includes('привет') || lowerMsg.includes('как дела') || 
             lowerMsg.includes('спасибо') || lowerMsg.includes('пока')) {
    requestType = 'emotional';
  }
  
  // Видео — недоступно
  if (requestType === 'video') {
    return {
      modelId: 'video-unavailable',
      modelName: 'Видео-генерация',
      provider: 'N/A',
      requestType: 'video',
      complexity: 'ultra',
      tokensRequired: 200,
      description: 'Видеогенерация доступна только через официальные сайты (Sora, Runway, Kling). API недоступен.',
      icon: '🎬',
      unavailable: true,
      free: false,
      note: '🎬 Используйте сайты:\n• openai.com/sora\n• runwayml.com\n• klingai.com'
    };
  }
  
  // Изображения через Pollinations
  if (requestType === 'image') {
    return {
      modelId: 'pollinations-image',
      modelName: 'Pollinations Image',
      provider: 'Pollinations',
      requestType: 'image',
      complexity: 'standard',
      tokensCost: 15,
      description: 'Бесплатная генерация изображений через Pollinations AI.',
      icon: '🎨',
      unavailable: false,
      paid: false,
      free: true,
      api: 'pollinations-image',
      pollinationsModel: 'image'
    };
  }
  
  // Выбор Pollinations модели по умолчанию
  const pollinationsModels = {
    'openai': MODEL_CATALOG['pollinations-openai'],
    'mistral': MODEL_CATALOG['pollinations-mistral'],
    'llama': MODEL_CATALOG['pollinations-llama'],
    'claude': MODEL_CATALOG['pollinations-claude'],
    'deepseek': MODEL_CATALOG['pollinations-deepseek']
  };
  
  const selectedModel = pollinationsModels[selectedPollinationsModel] || pollinationsModels['openai'];
  
  return {
    modelId: `pollinations-${selectedPollinationsModel}`,
    modelName: selectedModel.name,
    provider: selectedModel.provider,
    requestType: requestType,
    complexity: selectedModel.complexity,
    tokensRequired: selectedModel.tokensCost,
    description: selectedModel.description,
    icon: selectedModel.icon,
    bestFor: selectedModel.bestFor,
    unavailable: false,
    paid: false,
    free: true,
    api: 'pollinations',
    pollinationsModel: selectedPollinationsModel
  };
}

// ==================== СИСТЕМНЫЕ ПРОМПТЫ ====================

export function getSystemPromptForType(requestType, isVip, modelProvider = 'Pollinations') {
  const vipNote = isVip ? " Пользователь VIP — отвечай максимально полно и качественно." : "";
  
  const basePrompts = {
    text: `Ты — CerberAI, мощный ИИ-ассистент. Пиши грамотно, чётко, по существу. Используй Markdown. Отвечай на русском языке.${vipNote}`,
    code: `Ты — CerberAI, эксперт-программист. Пиши чистый код с комментариями. Объясняй сложные моменты.${vipNote}`,
    image: `Ты — CerberAI, помощник по генерации изображений. Опиши, что создашь.${vipNote}`,
    video: `Ты — CerberAI, видео-ассистент. Опиши концепцию видео.${vipNote}`,
    detailed: `Ты — CerberAI, аналитик. Давай развёрнутые, структурированные ответы.${vipNote}`,
    emotional: `Ты — CerberAI, дружелюбный собеседник. Общайся тепло. Создатель — Каин Сумрак, поддержка: @Ivanka58.${vipNote}`
  };
  
  return basePrompts[requestType] || basePrompts.text;
}

// ==================== ГЕНЕРАЦИЯ ОТВЕТОВ (ИСПРАВЛЕННАЯ ВЕРСИЯ) ====================

export async function generateTextResponse(userMessage, history, systemPrompt, route) {
  // Если модель недоступна (платная)
  if (route.unavailable && route.paid) {
    return `💎 *${route.modelName}*\n\n${route.description}\n\n⚠️ Эта модель требует оплаты API.\n\n💰 Стоимость: ${route.tokensRequired} токенов\n\n✅ Доступные бесплатные альтернативы:\n• 🟢 GPT-4o Mini (Pollinations)\n• 🔵 Mistral Large (Pollinations)\n• 🔵 Llama 3.1 (Pollinations)\n• 🔵 DeepSeek Chat (Pollinations)\n\nИспользуйте /models для выбора бесплатной модели\n📞 Поддержка: @Ivanka58`;
  }
  
  // Если другая причина недоступности
  if (route.unavailable) {
    return `⚠️ *${route.modelName}*\n\n${route.description}\n\n${route.note || 'Модель временно недоступна'}\n\nИспользуйте /models для выбора другой модели`;
  }
  
  // Генерация через Pollinations (ИСПРАВЛЕНО: используем POST вместо GET)
// В router.js замените вызов на:
import { askPollinationsWithFallback } from './providers/pollinations.js';

// В generateTextResponse:
if (route.api === 'pollinations') {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-5).map(msg => ({  // уменьшил до 5 для надёжности
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content || msg.text || ''
    })),
    { role: 'user', content: userMessage }
  ].filter(m => m.content.trim().length > 0);

  const result = await askPollinationsWithFallback(messages, route.pollinationsModel);
  
  if (result.success) {
    let response = result.content;
    if (result.usedFallback) {
      response += `\n\n_(⚠️ Использована резервная модель ${result.model})_`;
    }
    return response;
  }
  
  return `⚠️ ${result.error}\n\nПопробуйте позже или выберите другую модель /models`;
}
  
  // Неизвестный API
  return `⚠️ Неизвестный тип API: ${route.api}\n\nИспользуйте бесплатные модели Pollinations через /models`;
}

// Генерация изображений через Pollinations (остается GET — для картинок это нормально)
export async function generateImageResponse(prompt, modelId = 'pollinations-image') {
  try {
    // Формируем улучшенный промпт
    const enhancedPrompt = `${prompt}, high quality, detailed, professional`;
    
    // Pollinations Image API (GET — здесь это корректно, т.к. передаём только короткий промпт)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?seed=${Date.now()}&width=1024&height=1024&nologo=true&enhance=true`;
    
    // Проверяем доступность с таймаутом
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const checkResponse = await fetch(imageUrl, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!checkResponse.ok) {
      throw new Error(`Image service unavailable: ${checkResponse.status}`);
    }
    
    return {
      success: true,
      url: imageUrl,
      model: 'Pollinations Image',
      prompt: prompt
    };
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      error: error.message,
      model: 'Pollinations Image'
    };
  }
}

// ==================== МЕНЮ МОДЕЛЕЙ ====================

export function getModelsForMenu() {
  const categories = {
    '✅ Бесплатные (работают сейчас)': [
      'pollinations-openai',
      'pollinations-mistral',
      'pollinations-llama',
      'pollinations-claude',
      'pollinations-deepseek',
      'pollinations-image'
    ],
    '💎 OpenAI (платные)': [
      'gpt-4o',
      'gpt-4o-mini',
      'o1',
      'o3-mini',
      'dall-e-3'
    ],
    '💎 DeepSeek (платные)': [
      'deepseek-v3',
      'deepseek-r1',
      'deepseek-coder-v2'
    ],
    '💎 Anthropic Claude (платные)': [
      'claude-haiku-3.5',
      'claude-sonnet-3.7',
      'claude-opus-4'
    ],
    '💎 Google Gemini (платные)': [
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ],
    '💎 xAI Grok (платные)': [
      'grok-2',
      'grok-3'
    ],
    '💎 Meta Llama (платные)': [
      'llama-3-8b',
      'llama-3-70b'
    ],
    '💎 Mistral AI (платные)': [
      'mistral-large-3',
      'mistral-small'
    ],
    '🇷🇺 Российские (платные)': [
      'yandexgpt-4-pro',
      'yandexgpt-5-pro',
      'gigachat-2-max',
      'gigachat-2-pro',
      'kandinsky-3-1'
    ],
    '🎬 Видео (недоступно в API)': [
      'sora-2',
      'runway-gen-4-5',
      'kling-ai'
    ]
  };
  
  return Object.entries(categories).map(([name, modelIds]) => ({
    category: name,
    models: modelIds.map(id => {
      const model = MODEL_CATALOG[id];
      return model ? { 
        id, 
        name: model.name,
        provider: model.provider,
        icon: model.icon,
        cost: model.tokensCost,
        description: model.description.slice(0, 60) + '...',
        available: model.api === 'pollinations',
        free: model.free,
        paid: model.paid,
        api: model.api
      } : null;
    }).filter(Boolean)
  }));
}

// ==================== СТАТИСТИКА ====================

export function getModelsStats() {
  const all = Object.values(MODEL_CATALOG);
  const free = all.filter(m => m.free && m.api === 'pollinations');
  const paid = all.filter(m => m.paid);
  
  return {
    total: all.length,
    free: free.length,
    paid: paid.length,
    availableNow: free.length,
    byProvider: [...new Set(all.map(m => m.provider))].length,
    freeModelsList: free.map(m => m.name)
  };
}
