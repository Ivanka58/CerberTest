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

// Утилита: преобразование сообщений в строку для GET-запроса
function messagesToString(messages) {
  return messages.map(m => {
    if (m.role === 'system') return `System: ${m.content}`;
    if (m.role === 'assistant') return `Assistant: ${m.content}`;
    return `User: ${m.content}`;
  }).join('\n\n');
}

// ИСПРАВЛЕННАЯ функция: сначала POST, потом GET если упало
export async function askPollinations(messages, model = 'openai') {
  // Очищаем сообщения
  const cleanMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 
          m.role === 'system' ? 'system' : 'user',
    content: m.content || m.text || ''
  })).filter(m => m.content.trim().length > 0);

  if (cleanMessages.length === 0) {
    return { success: false, error: 'Нет сообщений для отправки', model };
  }

  console.log('Pollinations request:', { model, messagesCount: cleanMessages.length });

  // === ПОПЫТКА 1: POST (предпочтительный метод) ===
  try {
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

    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      let result;

      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        result = jsonData.choices?.[0]?.message?.content || 
                 jsonData.response || 
                 jsonData.text || 
                 jsonData.content;
      } else {
        result = await response.text();
      }

      if (result && result.trim().length > 0) {
        return {
          success: true,
          content: result.trim(),
          model: model,
          provider: 'Pollinations',
          method: 'POST'
        };
      }
    }
    
    // Если POST вернул ошибку — логируем и идём к GET
    const errorText = await response.text().catch(() => 'Unknown error');
    console.log(`POST failed (${response.status}), trying GET...`, errorText);

  } catch (postError) {
    console.log('POST error:', postError.message, '— trying GET fallback...');
  }

  // === ПОПЫТКА 2: GET (для коротких сообщений) ===
  try {
    const promptString = messagesToString(cleanMessages);
    
    // GET имеет ограничение по длине URL (~2000 символов)
    if (promptString.length > 1500) {
      console.log('Prompt too long for GET, skipping...');
      throw new Error('Prompt too long for GET fallback');
    }

    const seed = Date.now();
    const url = `${BASE_URL}/${encodeURIComponent(promptString)}?model=${model}&seed=${seed}&json=false`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Пустой ответ');
    }

    return {
      success: true,
      content: text.trim(),
      model: model,
      provider: 'Pollinations',
      method: 'GET'
    };

  } catch (getError) {
    console.log('GET fallback also failed:', getError.message);
  }

  // === ВСЁ УПАЛО ===
  return {
    success: false,
    error: `Pollinations недоступен (POST: 502/504, GET: failed). Попробуйте позже.`,
    model: model
  };
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

// Генерация изображения
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

    let url = `${IMAGE_URL}/prompt/${encodeURIComponent(prompt.trim())}`;
    url += `?width=${width}&height=${height}&seed=${seed}&nologo=${nologo}`;
    
    if (negative) url += `&negative=${encodeURIComponent(negative)}`;
    if (enhance) url += '&enhance=true';
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    const checkResponse = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
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

// Проверка работоспособности
export async function checkHealth() {
  const result = await generateText('Привет', 'openai');
  return {
    success: result.success,
    message: result.success ? 'API работает' : `Ошибка: ${result.error}`,
    response: result.success ? result.content.slice(0, 50) : null
  };
}

// Список моделей
export function getAvailableModels() {
  return [
    { id: 'openai', name: 'GPT-4o Mini', description: 'Быстрая и умная модель от OpenAI', bestFor: 'Общие задачи' },
    { id: 'mistral', name: 'Mistral Large', description: 'Европейская модель, сильна в логике', bestFor: 'Анализ' },
    { id: 'llama', name: 'Llama 3.1', description: 'Open-source лидер от Meta', bestFor: 'Код' },
    { id: 'claude', name: 'Claude Haiku', description: 'Быстрый и безопасный', bestFor: 'Безопасные ответы' },
    { id: 'deepseek', name: 'DeepSeek Chat', description: 'Китайская модель, сильна в коде', bestFor: 'Программирование' }
  ];
}

// Fallback на все модели по очереди
export async function askPollinationsWithFallback(messages, preferredModel = 'openai') {
  const models = ['openai', 'mistral', 'llama', 'claude', 'deepseek'];
  const order = [preferredModel, ...models.filter(m => m !== preferredModel)];
  
  for (const model of order) {
    console.log(`Trying model: ${model}...`);
    const result = await askPollinations(messages, model);
    
    if (result.success) {
      return { 
        ...result, 
        usedFallback: model !== preferredModel, 
        requestedModel: preferredModel 
      };
    }
    
    // Если 502 — ждём чуть-чуть перед следующей попыткой
    if (result.error?.includes('502') || result.error?.includes('504')) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  return {
    success: false,
    error: 'Все модели Pollinations недоступны. Сервис может быть перегружен.',
    model: preferredModel
  };
}

export default {
  askPollinations,
  generateText,
  generateImage,
  checkHealth,
  getAvailableModels,
  askPollinationsWithFallback,
  POLLINATIONS_MODELS
};
