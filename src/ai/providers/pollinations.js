// Pollinations AI — бесплатный API, работает из РФ без ключа!

const BASE_URL = 'https://text.pollinations.ai';
const IMAGE_URL = 'https://image.pollinations.ai';

// Доступные текстовые модели
export const POLLINATIONS_MODELS = {
  'openai': 'openai',      // GPT-4o Mini
  'mistral': 'mistral',    // Mistral Large
  'llama': 'llama',        // Llama 3.1
  'claude': 'claude',      // Claude Haiku
  'deepseek': 'deepseek'   // DeepSeek Chat
};

// Основная функция для текстовой генерации (ИСПРАВЛЕНО: POST вместо GET)
export async function askPollinations(messages, model = 'openai') {
  try {
    // ИСПРАВЛЕНИЕ: Преобразуем сообщения в формат OpenAI-compatible
    const cleanMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 
            m.role === 'system' ? 'system' : 'user',
      content: m.content || m.text || ''
    })).filter(m => m.content.trim().length > 0);

    if (cleanMessages.length === 0) {
      throw new Error('Нет сообщений для отправки');
    }

    console.log('Pollinations request:', { model, messagesCount: cleanMessages.length });

    // ИСПРАВЛЕНИЕ: Используем POST с JSON телом вместо GET с URL-параметрами
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain'
      },
      body: JSON.stringify({
        messages: cleanMessages,
        model: model,
        seed: Date.now(),
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pollinations HTTP error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    // Pollinations может вернуть JSON или plain text
    const contentType = response.headers.get('content-type') || '';
    let result;

    if (contentType.includes('application/json')) {
      const jsonData = await response.json();
      // Поддержка разных форматов ответа
      result = jsonData.choices?.[0]?.message?.content || 
               jsonData.response || 
               jsonData.text || 
               jsonData.content ||
               JSON.stringify(jsonData);
    } else {
      result = await response.text();
    }

    if (!result || result.trim().length === 0) {
      throw new Error('Пустой ответ от API');
    }

    return {
      success: true,
      content: result.trim(),
      model: model,
      provider: 'Pollinations'
    };

  } catch (error) {
    console.error('Pollinations API error:', error.message);
    
    return {
      success: false,
      error: error.message,
      model: model
    };
  }
}

// Простая генерация без истории
export async function generateText(prompt, model = 'openai') {
  if (!prompt || prompt.trim().length === 0) {
    return {
      success: false,
      error: 'Пустой промпт',
      model: model
    };
  }
  
  const messages = [{ role: 'user', content: prompt }];
  return askPollinations(messages, model);
}

// Генерация изображения (GET — здесь нормально, т.к. промпт короткий)
export async function generateImage(prompt, options = {}) {
  const {
    width = 1024,
    height = 1024,
    seed = Date.now(),
    nologo = true,
    negative = '',
    enhance = true
  } = options;
  
  try {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Пустой промпт для изображения');
    }

    // Формируем URL для изображения
    let url = `${IMAGE_URL}/prompt/${encodeURIComponent(prompt.trim())}`;
    url += `?width=${width}&height=${height}&seed=${seed}&nologo=${nologo}`;
    
    if (negative) {
      url += `&negative=${encodeURIComponent(negative)}`;
    }
    
    if (enhance) {
      url += '&enhance=true';
    }
    
    // Проверяем доступность с таймаутом
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    const checkResponse = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'CerberAI-Bot/2.0'
      }
    });
    
    clearTimeout(timeout);
    
    if (!checkResponse.ok) {
      throw new Error(`Image service unavailable: HTTP ${checkResponse.status}`);
    }
    
    return {
      success: true,
      url: url,
      prompt: prompt,
      width: width,
      height: height,
      provider: 'Pollinations'
    };
    
  } catch (error) {
    console.error('Pollinations Image error:', error.message);
    
    return {
      success: false,
      error: error.message,
      prompt: prompt
    };
  }
}

// Проверка работоспособности API
export async function checkHealth() {
  try {
    const testPrompt = 'Привет';
    const result = await generateText(testPrompt, 'openai');
    
    return {
      success: result.success,
      message: result.success ? 'API работает' : `Ошибка: ${result.error}`,
      response: result.success ? result.content.slice(0, 50) : null
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Критическая ошибка: ${error.message}`
    };
  }
}

// Получение списка моделей
export function getAvailableModels() {
  return [
    {
      id: 'openai',
      name: 'GPT-4o Mini',
      description: 'Быстрая и умная модель от OpenAI',
      bestFor: 'Общие задачи, быстрые ответы'
    },
    {
      id: 'mistral',
      name: 'Mistral Large',
      description: 'Европейская модель, сильна в логике',
      bestFor: 'Анализ, рассуждения, европейский контекст'
    },
    {
      id: 'llama',
      name: 'Llama 3.1',
      description: 'Open-source лидер от Meta',
      bestFor: 'Код, технические задачи'
    },
    {
      id: 'claude',
      name: 'Claude Haiku',
      description: 'Быстрый и безопасный',
      bestFor: 'Безопасные ответы, структурирование'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek Chat',
      description: 'Китайская модель, сильна в коде',
      bestFor: 'Программирование, математика'
    }
  ];
}

// Утилита для быстрой генерации с fallback
export async function askPollinationsWithFallback(messages, preferredModel = 'openai') {
  const models = ['openai', 'mistral', 'llama', 'claude', 'deepseek'];
  
  // Пробуем предпочтительную модель первой
  const order = [preferredModel, ...models.filter(m => m !== preferredModel)];
  
  for (const model of order) {
    const result = await askPollinations(messages, model);
    if (result.success) {
      return { ...result, usedFallback: model !== preferredModel, requestedModel: preferredModel };
    }
    console.log(`Model ${model} failed, trying next...`);
  }
  
  return {
    success: false,
    error: 'Все модели недоступны',
    model: preferredModel
  };
}

// Экспорт по умолчанию
export default {
  askPollinations,
  generateText,
  generateImage,
  checkHealth,
  getAvailableModels,
  askPollinationsWithFallback,
  POLLINATIONS_MODELS
};
