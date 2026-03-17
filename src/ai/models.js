// Каталог 130+ моделей CerberAI

export const AI_MODELS = [
  // OpenAI GPT Series
  { name: "GPT-4o", category: "OpenAI GPT", type: "text", tier: "pro", tokensPerRequest: 22, description: "Мощная мультимодальная модель" },
  { name: "GPT-4.5", category: "OpenAI GPT", type: "text", tier: "pro", tokensPerRequest: 28, description: "Расширенные возможности GPT-4" },
  { name: "o1", category: "OpenAI GPT", type: "text", tier: "ultra", tokensPerRequest: 40, description: "Модель с расширенным мышлением" },
  { name: "o3", category: "OpenAI GPT", type: "text", tier: "ultra", tokensPerRequest: 50, description: "Продвинутое рассуждение o3" },
  { name: "GPT-5", category: "OpenAI GPT", type: "text", tier: "ultra", tokensPerRequest: 60, description: "Следующее поколение GPT" },
  
  // DeepSeek
  { name: "DeepSeek-V3", category: "DeepSeek", type: "text", tier: "ultra", tokensPerRequest: 35, description: "Третья версия, топовая модель" },
  { name: "DeepSeek-R1", category: "DeepSeek", type: "text", tier: "ultra", tokensPerRequest: 40, description: "Reasoning-модель R1" },
  { name: "DeepSeek-V3.2", category: "DeepSeek", type: "text", tier: "ultra", tokensPerRequest: 42, description: "Третье поколение 2.0" },
  { name: "DeepSeek Coder-V2", category: "DeepSeek", type: "code", tier: "pro", tokensPerRequest: 22, description: "Улучшенный кодировщик V2" },
  
  // Claude
  { name: "Claude Opus 4.6", category: "Anthropic Claude", type: "text", tier: "ultra", tokensPerRequest: 65, description: "Новейший флагман Claude" },
  { name: "Claude Sonnet 4.6", category: "Anthropic Claude", type: "text", tier: "pro", tokensPerRequest: 28, description: "Последний Sonnet" },
  { name: "Claude Haiku 4.5", category: "Anthropic Claude", type: "text", tier: "standard", tokensPerRequest: 12, description: "Улучшенный быстрый Claude" },
  
  // Grok
  { name: "Grok-4", category: "xAI Grok", type: "text", tier: "ultra", tokensPerRequest: 50, description: "Флагман xAI четвёртого поколения" },
  { name: "Grok-5", category: "xAI Grok", type: "text", tier: "ultra", tokensPerRequest: 70, description: "Самый мощный Grok" },
  
  // Gemini
  { name: "Gemini 2.5 Pro", category: "Google Gemini", type: "text", tier: "pro", tokensPerRequest: 25, description: "Профессиональный Gemini 2.5" },
  { name: "Gemini Ultra", category: "Google Gemini", type: "text", tier: "ultra", tokensPerRequest: 45, description: "Самый мощный Gemini" },
  
  // Image Generation
  { name: "DALL-E 3", category: "Генерация изображений", type: "image", tier: "pro", tokensPerRequest: 40, description: "Фотореалистичные изображения" },
  { name: "Midjourney v6", category: "Генерация изображений", type: "image", tier: "ultra", tokensPerRequest: 55, description: "Лучший Midjourney" },
  { name: "Stable Diffusion XL", category: "Stability AI", type: "image", tier: "pro", tokensPerRequest: 30, description: "Флагман SDXL 1.0" },
  
  // Video
  { name: "Sora 2", category: "Генерация видео", type: "video", tier: "ultra", tokensPerRequest: 100, description: "OpenAI Sora второго поколения" },
  { name: "Runway Gen-4.5", category: "Генерация видео", type: "video", tier: "ultra", tokensPerRequest: 90, description: "Последний Runway Gen" },
];

export function getModelsByCategory() {
  const categories = {};
  for (const model of AI_MODELS) {
    if (!categories[model.category]) categories[model.category] = [];
    categories[model.category].push(model);
  }
  return categories;
}

export function getModelByName(name) {
  return AI_MODELS.find(m => m.name.toLowerCase() === name.toLowerCase());
}

export function getMinTokensForType(type) {
  const models = AI_MODELS.filter(m => m.type === type);
  if (models.length === 0) return 3;
  return Math.min(...models.map(m => m.tokensPerRequest));
}

export function getCheapestModelForType(type) {
  const models = AI_MODELS.filter(m => m.type === type);
  if (models.length === 0) return undefined;
  return models.reduce((min, m) => m.tokensPerRequest < min.tokensPerRequest ? m : min);
}

export const CATEGORIES = [...new Set(AI_MODELS.map(m => m.category))];
