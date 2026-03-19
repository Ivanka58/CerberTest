import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://github.com/Ivanka58/CerberTest',
    'X-Title': 'CerberAI Bot'
  }
});

// Маппинг ID моделей для OpenRouter
export const MODELS = {
  // OpenAI
  'openai/gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
  'openai/gpt-4': 'openai/gpt-4-turbo-preview',
  'openai/gpt-4-turbo': 'openai/gpt-4-turbo-preview',
  'openai/gpt-4o': 'openai/gpt-4o',
  'openai/gpt-4o-mini': 'openai/gpt-4o-mini',
  'openai/o1': 'openai/o1-preview',
  'openai/o1-preview': 'openai/o1-preview',
  'openai/o1-mini': 'openai/o1-mini',
  'openai/o3-mini': 'openai/o3-mini',
  'openai/dall-e-2': 'openai/dall-e-2',
  'openai/dall-e-3': 'openai/dall-e-3',
  
  // DeepSeek
  'deepseek/deepseek-chat': 'deepseek/deepseek-chat',
  'deepseek/deepseek-coder': 'deepseek/deepseek-coder',
  'deepseek/deepseek-coder-v2': 'deepseek/deepseek-coder-v2',
  'deepseek/deepseek-r1': 'deepseek/deepseek-r1',
  'deepseek/deepseek-r1-zero': 'deepseek/deepseek-r1-zero',
  'deepseek/deepseek-v2': 'deepseek/deepseek-chat-v2',
  'deepseek/deepseek-v3': 'deepseek/deepseek-chat',
  'deepseek/deepseek-math-7b': 'deepseek/deepseek-math-7b-instruct',
  
  // xAI
  'xai/grok-1': 'xai/grok-beta',
  'xai/grok-1.5': 'xai/grok-beta',
  'xai/grok-2': 'xai/grok-2',
  'xai/grok-2-mini': 'xai/grok-2-mini',
  'xai/grok-3': 'xai/grok-3',
  'xai/grok-1.5-vision': 'xai/grok-vision-beta',
  
  // Anthropic
  'anthropic/claude-3.5-haiku': 'anthropic/claude-3.5-haiku',
  'anthropic/claude-3.7-sonnet': 'anthropic/claude-3.7-sonnet',
  'anthropic/claude-4-opus': 'anthropic/claude-3-opus',
  'anthropic/claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet',
  'anthropic/claude-3-opus': 'anthropic/claude-3-opus',
  
  // Google
  'google/gemini-2.5-flash-preview-05-20': 'google/gemini-2.5-flash-preview-05-20',
  'google/gemini-2.5-pro-preview-05-20': 'google/gemini-2.5-pro-preview-05-20',
  'google/gemini-pro': 'google/gemini-1.5-pro-latest',
  'google/gemini-ultra': 'google/gemini-1.0-ultra',
  'google/gemini-nano': 'google/gemini-nano',
  
  // Mistral
  'mistralai/mistral-large': 'mistralai/mistral-large',
  'mistralai/mistral-small': 'mistralai/mistral-small',
  'mistralai/ministral-3b': 'mistralai/ministral-3b',
  'mistralai/ministral-8b': 'mistralai/ministral-8b',
  'mistralai/ministral-14b': 'mistralai/mistral-small',
  'mistralai/codestral-2405': 'mistralai/codestral-2405',
  'mistralai/mistral-medium': 'mistralai/mistral-medium',
  
  // Yandex (через OpenRouter может быть ограничена)
  'yandexgpt/yandexgpt': 'yandexgpt/yandexgpt',
  'yandexgpt/yandexgpt-lite': 'yandexgpt/yandexgpt-lite',
  
  // Sber (через OpenRouter может быть ограничена)
  'gigachat/gigachat-max': 'gigachat/gigachat-max',
  'gigachat/gigachat-pro': 'gigachat/gigachat-pro',
  'gigachat/gigachat-lite': 'gigachat/gigachat-lite',
  
  // Изображения
  'openai/dall-e-2': 'openai/dall-e-2',
  'openai/dall-e-3': 'openai/dall-e-3',
  'stabilityai/stable-diffusion-xl-base-1.0': 'stabilityai/stable-diffusion-xl-base-1.0',
  'midjourney/midjourney-v5.2': 'midjourney/midjourney-v5.2',
  'midjourney/midjourney-v6': 'midjourney/midjourney-v6',
  
  // Резерв
  'fallback': 'openai/gpt-4o-mini'
};

// Основная функция запроса к AI
export async function askAI(messages, modelId = 'openai/gpt-4o-mini') {
  // Проверяем, есть ли модель в маппинге
  const actualModelId = MODELS[modelId] || modelId;
  
  try {
    const completion = await openrouter.chat.completions.create({
      model: actualModelId,
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 0.9
    });
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    };
  } catch (error) {
    console.error('OpenRouter API error:', error.message);
    
    // Пробуем резервную модель, если основная не сработала
    if (modelId !== 'openai/gpt-4o-mini') {
      console.log('Trying fallback model...');
      try {
        const fallback = await openrouter.chat.completions.create({
          model: 'openai/gpt-4o-mini',
          messages: messages,
          temperature: 0.7,
          max_tokens: 4000
        });
        
        return {
          success: true,
          content: fallback.choices[0].message.content + '\n\n_(⚠️ Ответ от резервной модели)',
          model: fallback.model,
          usage: fallback.usage,
          fallback: true
        };
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError.message);
      }
    }
    
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
}

// Проверка доступности API
export async function checkAPIHealth() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data.data
      };
    }
    
    return {
      success: false,
      error: 'Invalid API key or service unavailable'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Получение списка доступных моделей
export async function getAvailableModels() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      models: data.data || []
    };
  } catch (error) {
    console.error('Error fetching models:', error);
    return {
      success: false,
      error: error.message,
      models: []
    };
  }
}

// Расчёт стоимости (примерная)
export function calculateCost(modelId, usage) {
  // Цены за 1K токенов (примерные, актуальные нужно проверять на openrouter.ai)
  const prices = {
    'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
    'openai/gpt-4o': { input: 2.5, output: 10 },
    'openai/gpt-4-turbo': { input: 10, output: 30 },
    'openai/o1-preview': { input: 15, output: 60 },
    'openai/o1-mini': { input: 3, output: 12 },
    'anthropic/claude-3.5-haiku': { input: 0.25, output: 1.25 },
    'anthropic/claude-3.7-sonnet': { input: 3, output: 15 },
    'anthropic/claude-3-opus': { input: 15, output: 75 },
    'deepseek/deepseek-chat': { input: 0.14, output: 0.28 },
    'deepseek/deepseek-coder-v2': { input: 0.14, output: 0.28 },
    'deepseek/deepseek-r1': { input: 0.55, output: 2.19 },
    'xai/grok-2': { input: 5, output: 15 },
    'xai/grok-2-mini': { input: 0.6, output: 2.4 },
    'google/gemini-2.5-flash-preview-05-20': { input: 0.15, output: 0.6 },
    'google/gemini-2.5-pro-preview-05-20': { input: 1.25, output: 10 },
    'mistralai/mistral-small': { input: 0.2, output: 0.6 },
    'mistralai/mistral-large': { input: 2, output: 6 }
  };
  
  const price = prices[modelId] || { input: 1, output: 3 };
  const inputCost = (usage.prompt_tokens / 1000) * price.input;
  const outputCost = (usage.completion_tokens / 1000) * price.output;
  
  return {
    input: inputCost.toFixed(4),
    output: outputCost.toFixed(4),
    total: (inputCost + outputCost).toFixed(4),
    currency: 'USD'
  };
}
