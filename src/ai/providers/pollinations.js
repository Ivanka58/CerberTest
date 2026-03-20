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

// Основная функция для текстовой генерации
export async function askPollinations(messages, model = 'openai') {
  try {
    // Формируем промпт из сообщений
    const prompt = messages.map(m => {
      if (m.role === 'system') return `Инструкция: ${m.content}`;
      if (m.role === 'user') return `Вопрос: ${m.content}`;
      if (m.role === 'assistant') return `Ответ: ${m.content}`;
      return m.content;
    }).join('\n\n');
    
    // Добавляем случайный seed для уникальности
    const seed = Date.now();
    const url = `${BASE_URL}/${encodeURIComponent(prompt)}?model=${model}&seed=${seed}&json=false`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain, */*',
        'User-Agent': 'CerberAI-Bot/2.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Пустой ответ от API');
    }
    
    // Очищаем ответ от возможного мусора
    const cleanText = text.trim();
    
    return {
      success: true,
      content: cleanText,
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
    // Формируем URL для изображения
    let url = `${IMAGE_URL}/prompt/${encodeURIComponent(prompt)}`;
    url += `?width=${width}&height=${height}&seed=${seed}&nologo=${nologo}`;
    
    if (negative) {
      url += `&negative=${encodeURIComponent(negative)}`;
    }
    
    if (enhance) {
      url += '&enhance=true';
    }
    
    // Проверяем доступность
    const checkResponse = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'CerberAI-Bot/2.0'
      }
    });
    
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

// Экспорт по умолчанию
export default {
  askPollinations,
  generateText,
  generateImage,
  checkHealth,
  getAvailableModels,
  POLLINATIONS_MODELS
};
