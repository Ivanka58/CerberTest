import { askAI, MODELS } from './providers/openrouter.js';

// ==================== КАТАЛОГ ВСЕХ 130+ МОДЕЛЕЙ ====================

const MODEL_CATALOG = {
  // ==================== OPENAI ====================
  // GPT-1, GPT-2 (исторические, через OpenRouter не доступны, но добавим как legacy)
  'gpt-1': {
    name: 'GPT-1',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Историческая модель 2018 года. 117M параметров. Первый GPT.',
    bestFor: 'Исторический интерес, сравнение эволюции',
    tokensCost: 5,
    complexity: 'basic',
    icon: '📜',
    modelId: null, // Legacy, не доступен через API
    legacy: true
  },
  'gpt-2': {
    name: 'GPT-2',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Историческая модель 2019. 1.5B параметров. Первая "вирусная" модель.',
    bestFor: 'История AI, сравнение возможностей',
    tokensCost: 5,
    complexity: 'basic',
    icon: '📜',
    modelId: null,
    legacy: true
  },
  'gpt-3': {
    name: 'GPT-3',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Революция 2020 года. 175B параметров. Текстовый интеллект.',
    bestFor: 'Базовые тексты, простые запросы',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'openai/gpt-3.5-turbo-0301' // Ближайший аналог
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Оптимизированная версия GPT-3. Быстрая и экономичная.',
    bestFor: 'Повседневные задачи, чаты, переводы',
    tokensCost: 10,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'openai/gpt-3.5-turbo'
  },
  'gpt-4': {
    name: 'GPT-4',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Классический GPT-4. 8K контекст. Надёжный интеллект.',
    bestFor: 'Анализ, документы, структурирование',
    tokensCost: 30,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'openai/gpt-4'
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Улучшенный GPT-4. 128K контекст. Быстрее и дешевле.',
    bestFor: 'Длинные документы, сложный анализ',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🔵',
    modelId: 'openai/gpt-4-turbo'
  },
  'gpt-4o': {
    name: 'GPT-4o',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Омни-модель. Текст, аудио, изображения. Универсальный флагман.',
    bestFor: 'Всё: от простых вопросов до сложного кода',
    tokensCost: 20,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'openai/gpt-4o'
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Лёгкая версия GPT-4o. 128K контекст. Очень дешевая.',
    bestFor: 'Быстрые ответы, рутина, большие объёмы',
    tokensCost: 6,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'openai/gpt-4o-mini'
  },
  'gpt-4.5': {
    name: 'GPT-4.5',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Промежуточная версия. Улучшенное следование инструкциям.',
    bestFor: 'Точные задачи, форматирование',
    tokensCost: 35,
    complexity: 'pro',
    icon: '🔵',
    modelId: 'openai/gpt-4-0125-preview'
  },
  'gpt-4.1': {
    name: 'GPT-4.1',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Обновлённая линейка 2024. Улучшенное качество.',
    bestFor: 'Современные задачи, обновлённые знания',
    tokensCost: 28,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'openai/gpt-4-turbo-preview'
  },
  'gpt-4.1-mini': {
    name: 'GPT-4.1 Mini',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Компактная версия 4.1. Баланс цена/качество.',
    bestFor: 'Рабочие задачи, быстрые решения',
    tokensCost: 15,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'openai/gpt-4-1106-preview'
  },
  'gpt-4.1-nano': {
    name: 'GPT-4.1 Nano',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Минимальная версия. Максимальная скорость.',
    bestFor: 'Мгновенные ответы, простые запросы',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'openai/gpt-3.5-turbo-1106'
  },
  // o-серия (reasoning)
  'o1': {
    name: 'o1',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Reasoning модель. Думает перед ответом. Сложная логика.',
    bestFor: 'Математика, наука, сложные задачи',
    tokensCost: 45,
    complexity: 'ultra',
    icon: '⭐',
    modelId: 'openai/o1'
  },
  'o1-preview': {
    name: 'o1 Preview',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Превью версия o1. Рассуждения в реальном времени.',
    bestFor: 'Исследования, аналитика',
    tokensCost: 40,
    complexity: 'ultra',
    icon: '⭐',
    modelId: 'openai/o1-preview'
  },
  'o1-mini': {
    name: 'o1 Mini',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Компактный o1. Быстрее, дешевле, но умный.',
    bestFor: 'Быстрые рассуждения, логика',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'openai/o1-mini'
  },
  'o3': {
    name: 'o3',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Следующее поколение reasoning. Ещё мощнее o1.',
    bestFor: 'Сверхсложные задачи, исследования',
    tokensCost: 60,
    complexity: 'ultra',
    icon: '⭐',
    modelId: 'openai/o3-mini' // Пока mini доступен
  },
  'o3-mini': {
    name: 'o3 Mini',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Доступный o3. Отличное reasoning за меньшие деньги.',
    bestFor: 'Повседневные сложные задачи',
    tokensCost: 20,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'openai/o3-mini'
  },
  'o4-mini': {
    name: 'o4 Mini',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Будущая модель. Компактное мышление нового поколения.',
    bestFor: 'Прогнозирование, стратегия',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'openai/o3-mini', // Placeholder
    preview: true
  },
  // GPT-5 серия (ожидаемые)
  'gpt-5': {
    name: 'GPT-5',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Будущий флагман. AGI-близкие возможности. Ожидается в 2025.',
    bestFor: 'Универсальный интеллект нового уровня',
    tokensCost: 100,
    complexity: 'ultra',
    icon: '👑',
    modelId: null,
    upcoming: true
  },
  'gpt-5-pro': {
    name: 'GPT-5 Pro',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Максимальная версия GPT-5. Для профессионалов.',
    bestFor: 'Enterprise, исследования, разработка',
    tokensCost: 200,
    complexity: 'ultra',
    icon: '👑',
    modelId: null,
    upcoming: true
  },
  'gpt-5-mini': {
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Доступная версия GPT-5. Для всех пользователей.',
    bestFor: 'Повседневное использование',
    tokensCost: 30,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    upcoming: true
  },
  'gpt-5-nano': {
    name: 'GPT-5 Nano',
    provider: 'OpenAI',
    type: 'chat',
    description: 'Минимальная GPT-5. Встроенная в устройства.',
    bestFor: 'Edge computing, мобильные устройства',
    tokensCost: 10,
    complexity: 'basic',
    icon: '🟢',
    modelId: null,
    upcoming: true
  },

  // ==================== DEEPSEEK ====================
  'deepseek-coder': {
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    type: 'code',
    description: 'Первая кодовая модель DeepSeek. 7B параметров.',
    bestFor: 'Базовое программирование, учеба',
    tokensCost: 8,
    complexity: 'basic',
    icon: '💻',
    modelId: 'deepseek/deepseek-coder-6.7b-instruct'
  },
  'deepseek-llm': {
    name: 'DeepSeek LLM',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Базовая языковая модель. 67B параметров.',
    bestFor: 'Общие задачи, диалоги',
    tokensCost: 10,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'deepseek/deepseek-llm-67b-chat'
  },
  'deepseek-moe': {
    name: 'DeepSeek MoE',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Mixture of Experts. Эффективная архитектура.',
    bestFor: 'Большие задачи, оптимизация',
    tokensCost: 12,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'deepseek/deepseek-moe-16b-chat'
  },
  'deepseek-math-7b': {
    name: 'DeepSeek Math 7B',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Специализация: математика. Обучена на задачах.',
    bestFor: 'Математика, логика, олимпиады',
    tokensCost: 10,
    complexity: 'pro',
    icon: '📐',
    modelId: 'deepseek/deepseek-math-7b-instruct'
  },
  'deepseek-v2': {
    name: 'DeepSeek-V2',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Вторая версия. 236B параметров, 21B активных.',
    bestFor: 'Сложные диалоги, анализ',
    tokensCost: 12,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'deepseek/deepseek-v2'
  },
  'deepseek-v2-lite': {
    name: 'DeepSeek-V2 Lite',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Облегчённая V2. Быстрее, дешевле.',
    bestFor: 'Быстрые задачи, мобильные',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'deepseek/deepseek-v2-lite'
  },
  'deepseek-v2-chat': {
    name: 'DeepSeek-V2 Chat',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Оптимизирована для диалогов. Естественное общение.',
    bestFor: 'Чат-боты, поддержка, общение',
    tokensCost: 10,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'deepseek/deepseek-v2-chat'
  },
  'deepseek-v2-chat-lite': {
    name: 'DeepSeek-V2 Chat Lite',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Компактная чат-версия. Мгновенные ответы.',
    bestFor: 'Быстрые чаты, уведомления',
    tokensCost: 6,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'deepseek/deepseek-v2-chat-lite'
  },
  'deepseek-coder-v2': {
    name: 'DeepSeek Coder-V2',
    provider: 'DeepSeek',
    type: 'code',
    description: 'Улучшенный кодер. 300+ языков, 16B параметров.',
    bestFor: 'Профессиональная разработка, отладка',
    tokensCost: 15,
    complexity: 'pro',
    icon: '💻',
    modelId: 'deepseek/deepseek-coder-v2'
  },
  'deepseek-vl2': {
    name: 'DeepSeek VL2',
    provider: 'DeepSeek',
    type: 'vision',
    description: 'Vision-Language. Понимает изображения + текст.',
    bestFor: 'Анализ картинок, OCR, описание',
    tokensCost: 18,
    complexity: 'pro',
    icon: '👁️',
    modelId: 'deepseek/deepseek-vl2'
  },
  'deepseek-v3': {
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Флагман 2024. 671B параметров, 37B активных. GPT-4 уровень.',
    bestFor: 'Всё: код, текст, анализ, математика',
    tokensCost: 15,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'deepseek/deepseek-chat'
  },
  'deepseek-r1': {
    name: 'DeepSeek-R1',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Reasoning модель. Думает как o1, но open-source.',
    bestFor: 'Логика, математика, научные задачи',
    tokensCost: 18,
    complexity: 'ultra',
    icon: '⭐',
    modelId: 'deepseek/deepseek-r1'
  },
  'deepseek-r1-zero': {
    name: 'DeepSeek-R1-Zero',
    provider: 'DeepSeek',
    description: 'Базовая версия R1. Чистое обучение RL.',
    bestFor: 'Исследования, сравнение методов',
    tokensCost: 16,
    complexity: 'ultra',
    icon: '⭐',
    modelId: 'deepseek/deepseek-r1-zero'
  },
  'deepseek-v3.1': {
    name: 'DeepSeek-V3.1',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Обновление V3. Улучшенное качество.',
    bestFor: 'Современные задачи, обновлённые данные',
    tokensCost: 16,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'deepseek/deepseek-v3.1',
    upcoming: true
  },
  'deepseek-v3.2': {
    name: 'DeepSeek-V3.2',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Следующее поколение. Ещё мощнее.',
    bestFor: 'Сложные проекты, масштабирование',
    tokensCost: 18,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    upcoming: true
  },
  'deepseek-v3.2-speciale': {
    name: 'DeepSeek-V3.2 Speciale',
    provider: 'DeepSeek',
    type: 'chat',
    description: 'Специальная версия. Оптимизирована под задачи.',
    bestFor: 'Конкретные домены, специализация',
    tokensCost: 20,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    upcoming: true
  },
  'deepseek-prover-v2-7b': {
    name: 'DeepSeek-Prover-V2 (7B)',
    provider: 'DeepSeek',
    type: 'math',
    description: 'Математический доказатель. Компактная версия.',
    bestFor: 'Доказательства теорем, формальная логика',
    tokensCost: 12,
    complexity: 'ultra',
    icon: '📐',
    modelId: null,
    upcoming: true
  },
  'deepseek-prover-v2-671b': {
    name: 'DeepSeek-Prover-V2 (671B)',
    provider: 'DeepSeek',
    type: 'math',
    description: 'Полная версия доказателя. Максимальная мощь.',
    bestFor: 'Сложнейшие математические задачи',
    tokensCost: 40,
    complexity: 'ultra',
    icon: '👑',
    modelId: null,
    upcoming: true
  },
  'janus-pro': {
    name: 'Janus-Pro',
    provider: 'DeepSeek',
    type: 'image',
    description: 'Универсальная модель. Текст + изображения.',
    bestFor: 'Генерация картинок, анализ, мультимодальность',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🎨',
    modelId: null,
    upcoming: true
  },

  // ==================== XAI (GROK) ====================
  'grok-1': {
    name: 'Grok-1',
    provider: 'xAI',
    type: 'chat',
    description: 'Первая версия 2023. 314B параметров. Доступ к X.',
    bestFor: 'Новости, тренды, актуальная информация',
    tokensCost: 15,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'xai/grok-1'
  },
  'grok-1.5': {
    name: 'Grok-1.5',
    provider: 'xAI',
    type: 'chat',
    description: 'Улучшенная версия. Лучшее следование инструкциям.',
    bestFor: 'Точные задачи, форматирование',
    tokensCost: 18,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'xai/grok-1.5'
  },
  'grok-1.5-vision': {
    name: 'Grok-1.5 Vision',
    provider: 'xAI',
    type: 'vision',
    description: 'Мультимодальная. Понимает изображения.',
    bestFor: 'Анализ картинок, мемы, документы',
    tokensCost: 22,
    complexity: 'pro',
    icon: '👁️',
    modelId: 'xai/grok-1.5-vision'
  },
  'grok-2': {
    name: 'Grok-2',
    provider: 'xAI',
    type: 'chat',
    description: 'Второе поколение. Остроумный, прямолинейный.',
    bestFor: 'Общение, юмор, новости, анализ',
    tokensCost: 20,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'xai/grok-2'
  },
  'grok-2-mini': {
    name: 'Grok-2 Mini',
    provider: 'xAI',
    type: 'chat',
    description: 'Компактный Grok-2. Быстрый и доступный.',
    bestFor: 'Быстрые вопросы, чаты',
    tokensCost: 12,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'xai/grok-2-mini'
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
    modelId: 'xai/grok-3'
  },
  'grok-4': {
    name: 'Grok-4',
    provider: 'xAI',
    type: 'chat',
    description: 'Будущее поколение. AGI-ориентированный.',
    bestFor: 'Прорывные задачи, инновации',
    tokensCost: 50,
    complexity: 'ultra',
    icon: '⭐',
    modelId: null,
    upcoming: true
  },
  'grok-4.1': {
    name: 'Grok-4.1',
    provider: 'xAI',
    type: 'chat',
    description: 'Обновлённая версия. Улучшенное качество.',
    bestFor: 'Современные вызовы, актуальность',
    tokensCost: 55,
    complexity: 'ultra',
    icon: '⭐',
    modelId: null,
    upcoming: true
  },
  'grok-5': {
    name: 'Grok-5',
    provider: 'xAI',
    type: 'chat',
    description: 'Флагман будущего. Максимальный интеллект xAI.',
    bestFor: 'Универсальный AGI-ассистент',
    tokensCost: 80,
    complexity: 'ultra',
    icon: '👑',
    modelId: null,
    upcoming: true
  },

  // ==================== ANTHROPIC (CLAUDE) ====================
  'claude-haiku-3.5': {
    name: 'Claude Haiku 3.5',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Самый быстрый Claude. Мгновенные ответы.',
    bestFor: 'Чаты, уведомления, быстрые задачи',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'anthropic/claude-3.5-haiku'
  },
  'claude-haiku-4.5': {
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Обновлённая версия. Лучшее качество, та же скорость.',
    bestFor: 'Современные быстрые задачи',
    tokensCost: 10,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'anthropic/claude-3.5-haiku-20241022',
    preview: true
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
    modelId: 'anthropic/claude-3.7-sonnet'
  },
  'claude-sonnet-4': {
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Новое поколение. Улучшенное рассуждение.',
    bestFor: 'Анализ, планирование, стратегия',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'anthropic/claude-4-sonnet',
    upcoming: true
  },
  'claude-sonnet-4.5': {
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Промежуточное обновление. Оптимизация качества.',
    bestFor: 'Современные рабочие задачи',
    tokensCost: 28,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    upcoming: true
  },
  'claude-sonnet-4.6': {
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Улучшенная версия. Максимальный баланс.',
    bestFor: 'Сложные проекты, компромисс скорость/качество',
    tokensCost: 30,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    upcoming: true
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
    modelId: 'anthropic/claude-4-opus'
  },
  'claude-opus-4.1': {
    name: 'Claude Opus 4.1',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Обновлённый Opus. Улучшенное следование инструкциям.',
    bestFor: 'Точные сложные задачи, креатив',
    tokensCost: 55,
    complexity: 'ultra',
    icon: '⭐',
    modelId: 'anthropic/claude-4-opus-20241022',
    preview: true
  },
  'claude-opus-4.5': {
    name: 'Claude Opus 4.5',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Промежуточное обновление. Оптимизация стоимости.',
    bestFor: 'Доступный ультра-уровень',
    tokensCost: 60,
    complexity: 'ultra',
    icon: '⭐',
    modelId: null,
    upcoming: true
  },
  'claude-opus-4.6': {
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Максимальная версия. Пик возможностей Claude.',
    bestFor: 'Премиум задачи, искусство, наука',
    tokensCost: 70,
    complexity: 'ultra',
    icon: '👑',
    modelId: null,
    upcoming: true
  },
  'claude-gov': {
    name: 'Claude Gov',
    provider: 'Anthropic',
    type: 'chat',
    description: 'Государственная версия. Соответствие стандартам.',
    bestFor: 'Госучреждения, регулируемые отрасли',
    tokensCost: 80,
    complexity: 'ultra',
    icon: '🏛️',
    modelId: null,
    upcoming: true
  },
  'claude-code': {
    name: 'Claude Code',
    provider: 'Anthropic',
    type: 'code',
    description: 'Специализация: программирование. IDE-интеграция.',
    bestFor: 'Разработка, рефакторинг, отладка, архитектура',
    tokensCost: 40,
    complexity: 'pro',
    icon: '💻',
    modelId: 'anthropic/claude-3.5-sonnet', // Пока sonnet
    preview: true
  },

  // ==================== GOOGLE (GEMINI) ====================
  'gemini-nano': {
    name: 'Gemini Nano',
    provider: 'Google',
    type: 'chat',
    description: 'Минимальная версия. Для устройств и edge.',
    bestFor: 'Мобильные устройства, офлайн-работа',
    tokensCost: 5,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'google/gemini-nano'
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    provider: 'Google',
    type: 'chat',
    description: 'Стандартная версия. Универсальный интеллект.',
    bestFor: 'Общие задачи, бизнес, образование',
    tokensCost: 15,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'google/gemini-pro'
  },
  'gemini-ultra': {
    name: 'Gemini Ultra',
    provider: 'Google',
    type: 'chat',
    description: 'Максимальная версия 1.0. Сложные задачи.',
    bestFor: 'Исследования, наука, профессиональный анализ',
    tokensCost: 40,
    complexity: 'ultra',
    icon: '⭐',
    modelId: 'google/gemini-ultra'
  },
  'gemini-2.5-flash': {
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    type: 'chat',
    description: 'Молниеносная. 1M контекст. Для больших объёмов.',
    bestFor: 'Суммаризация, обработка документов, скорость',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'google/gemini-2.5-flash-preview-05-20'
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
    modelId: 'google/gemini-2.5-pro-preview-05-20'
  },
  'gemini-3.0-pro': {
    name: 'Gemini 3.0 Pro',
    provider: 'Google',
    type: 'chat',
    description: 'Третье поколение. Новая архитектура.',
    bestFor: 'Современные вызовы, мультимодальность',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    upcoming: true
  },
  'gemini-3.0-deep-think': {
    name: 'Gemini 3.0 Deep Think',
    provider: 'Google',
    type: 'chat',
    description: 'Reasoning версия. Глубокое мышление.',
    bestFor: 'Сложная логика, математика, стратегия',
    tokensCost: 35,
    complexity: 'ultra',
    icon: '⭐',
    modelId: null,
    upcoming: true
  },

  // ==================== MISTRAL ====================
  'mistral-large-3': {
    name: 'Mistral Large 3',
    provider: 'Mistral',
    type: 'chat',
    description: 'Флагман европейского AI. 123B параметров.',
    bestFor: 'Сложные рассуждения, многоязычность, код',
    tokensCost: 22,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'mistralai/mistral-large'
  },
  'ministral-3b': {
    name: 'Ministral 3B',
    provider: 'Mistral',
    type: 'chat',
    description: 'Минимальная версия. Для edge-устройств.',
    bestFor: 'Мобильные приложения, встраивание',
    tokensCost: 4,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'mistralai/ministral-3b'
  },
  'ministral-8b': {
    name: 'Ministral 8B',
    provider: 'Mistral',
    type: 'chat',
    description: 'Компактная. Баланс размер/качество.',
    bestFor: 'Быстрые задачи, чаты, уведомления',
    tokensCost: 6,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'mistralai/ministral-8b'
  },
  'ministral-14b': {
    name: 'Ministral 14B',
    provider: 'Mistral',
    type: 'chat',
    description: 'Средняя версия. Хорошее качество.',
    bestFor: 'Повседневные задачи, образование',
    tokensCost: 10,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'mistralai/ministral-14b'
  },
  'magistral': {
    name: 'Magistral',
    provider: 'Mistral',
    type: 'chat',
    description: 'Премиум версия. Максимальные возможности.',
    bestFor: 'Enterprise, профессиональные задачи',
    tokensCost: 30,
    complexity: 'ultra',
    icon: '⭐',
    modelId: 'mistralai/magistral',
    upcoming: true
  },
  'medium-3': {
    name: 'Medium 3',
    provider: 'Mistral',
    type: 'chat',
    description: 'Средний уровень. Оптимальный выбор.',
    bestFor: 'Бизнес, стартапы, разработка',
    tokensCost: 14,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'mistralai/mistral-medium'
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
    modelId: 'mistralai/mistral-small'
  },
  'document-ai': {
    name: 'Document AI',
    provider: 'Mistral',
    type: 'document',
    description: 'Специализация: документы. OCR, анализ, извлечение.',
    bestFor: 'Контракты, отчёты, инвойсы, формы',
    tokensCost: 15,
    complexity: 'pro',
    icon: '📄',
    modelId: null,
    upcoming: true
  },
  'codestral': {
    name: 'Codestral',
    provider: 'Mistral',
    type: 'code',
    description: 'Кодовая модель. 80+ языков программирования.',
    bestFor: 'Разработка, ревью кода, документация',
    tokensCost: 18,
    complexity: 'pro',
    icon: '💻',
    modelId: 'mistralai/codestral-2405'
  },

  // ==================== YANDEX (YANDEXGPT + ALICE) ====================
  'yandexgpt-1': {
    name: 'YandexGPT 1',
    provider: 'Yandex',
    type: 'chat',
    description: 'Первая версия 2023. Базовый русский AI.',
    bestFor: 'Простые задачи, история развития',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🔵',
    modelId: 'yandexgpt/yandexgpt-lite'
  },
  'yandexgpt-2': {
    name: 'YandexGPT 2',
    provider: 'Yandex',
    type: 'chat',
    description: 'Улучшенная версия. Лучшее понимание контекста.',
    bestFor: 'Диалоги, общие вопросы',
    tokensCost: 10,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'yandexgpt/yandexgpt-lite'
  },
  'yandexgpt-3-lite': {
    name: 'YandexGPT 3 Lite',
    provider: 'Yandex',
    type: 'chat',
    description: 'Третье поколение, лёгкая версия. Быстрая.',
    bestFor: 'Быстрые ответы, мобильные устройства',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'yandexgpt/yandexgpt-lite'
  },
  'yandexgpt-3-pro': {
    name: 'YandexGPT 3 Pro',
    provider: 'Yandex',
    type: 'chat',
    description: 'Полная версия 3.0. Хорошее качество.',
    bestFor: 'Рабочие задачи, документы',
    tokensCost: 15,
    complexity: 'standard',
    icon: '🔵',
    modelId: 'yandexgpt/yandexgpt'
  },
  'yandexgpt-4-lite': {
    name: 'YandexGPT 4 Lite',
    provider: 'Yandex',
    type: 'chat',
    description: 'Четвёртое поколение, компактное. Эффективное.',
    bestFor: 'Современные быстрые задачи',
    tokensCost: 10,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'yandexgpt/yandexgpt-lite'
  },
  'yandexgpt-4-pro': {
    name: 'YandexGPT 4 Pro',
    provider: 'Yandex',
    type: 'chat',
    description: 'Флагман 4.0. Улучшенное рассуждение.',
    bestFor: 'Анализ, планирование, сложные задачи',
    tokensCost: 20,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'yandexgpt/yandexgpt'
  },
  'yandexgpt-5-lite-pretrain': {
    name: 'YandexGPT 5 Lite Pretrain',
    provider: 'Yandex',
    type: 'chat',
    description: 'Базовая версия 5.0. Предобученная.',
    bestFor: 'Исследования, fine-tuning, разработка',
    tokensCost: 12,
    complexity: 'standard',
    icon: '🔵',
    modelId: null,
    upcoming: true
  },
  'yandexgpt-5-lite-instruct': {
    name: 'YandexGPT 5 Lite Instruct',
    provider: 'Yandex',
    type: 'chat',
    description: 'Инструктированная версия. Следует командам.',
    bestFor: 'Ассистенты, чат-боты, автоматизация',
    tokensCost: 12,
    complexity: 'standard',
    icon: '🔵',
    modelId: null,
    upcoming: true
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
    upcoming: true
  },
  'yandexgpt-5.1-pro': {
    name: 'YandexGPT 5.1 Pro',
    provider: 'Yandex',
    type: 'chat',
    description: 'Обновление 5.1. Улучшенное качество.',
    bestFor: 'Современные профессиональные задачи',
    tokensCost: 28,
    complexity: 'pro',
    icon: '🟣',
    modelId: null,
    upcoming: true
  },
  'alice-ai-llm-1-0': {
    name: 'Alice AI LLM 1.0',
    provider: 'Yandex',
    type: 'chat',
    description: 'Алиса как LLM. Голосовой помощник нового поколения.',
    bestFor: 'Голосовые интерфейсы, умный дом, помощник',
    tokensCost: 15,
    complexity: 'standard',
    icon: '🎙️',
    modelId: null,
    upcoming: true
  },

  // ==================== SBER (GIGACHAT) ====================
  'gigachat-2-max': {
    name: 'GigaChat 2 Max',
    provider: 'Sber',
    type: 'chat',
    description: 'Максимальная версия. Корпоративный уровень.',
    bestFor: 'Enterprise, сложные бизнес-задачи',
    tokensCost: 25,
    complexity: 'pro',
    icon: '🟣',
    modelId: 'gigachat/gigachat-max'
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
    modelId: 'gigachat/gigachat-pro'
  },
  'gigachat-2-lite': {
    name: 'GigaChat 2 Lite',
    provider: 'Sber',
    type: 'chat',
    description: 'Лёгкая версия. Быстрая и доступная.',
    bestFor: 'Быстрые задачи, чаты, уведомления',
    tokensCost: 10,
    complexity: 'basic',
    icon: '🟢',
    modelId: 'gigachat/gigachat-lite'
  },
  'gigachat3-10b-a1.8b': {
    name: 'GigaChat3-10B-A1.8B',
    provider: 'Sber',
    type: 'chat',
    description: 'Третье поколение, компактное. MoE архитектура.',
    bestFor: 'Эффективные задачи, мобильные',
    tokensCost: 8,
    complexity: 'basic',
    icon: '🟢',
    modelId: null,
    upcoming: true
  },
  'gigachat3-702b-a36b-ultra': {
    name: 'GigaChat3-702B-A36B (Ultra)',
    provider: 'Sber',
    type: 'chat',
    description: 'Максимальная версия 3.0. 702B параметров.',
    bestFor: 'Сверхсложные задачи, исследования',
    tokensCost: 50,
    complexity: 'ultra',
    icon: '👑',
    modelId: null,
    upcoming: true
  },

  // ==================== ИЗОБРАЖЕНИЯ ====================
  // OpenAI
  'dall-e-1': {
    name: 'DALL-E 1',
    provider: 'OpenAI',
    type: 'image',
    description: 'Историческая версия 2021. Первый текст-в-изображение.',
    bestFor: 'История AI, сравнение эволюции',
    tokensCost: 20,
    complexity: 'basic',
    icon: '📜',
    modelId: null,
    legacy: true
  },
  'dall-e-2': {
    name: 'DALL-E 2',
    provider: 'OpenAI',
    type: 'image',
    description: 'Вторая версия. Лучшее качество, редактирование.',
    bestFor: 'Базовая генерация, редактирование',
    tokensCost: 30,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'openai/dall-e-2'
  },
  'dall-e-3': {
    name: 'DALL-E 3',
    provider: 'OpenAI',
    type: 'image',
    description: 'Флагман. Точное следование промптам, детали.',
    bestFor: 'Профессиональные иллюстрации, концепт-арт',
    tokensCost: 40,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'openai/dall-e-3'
  },
  // Midjourney
  'midjourney-v5': {
    name: 'Midjourney v5',
    provider: 'Midjourney',
    type: 'image',
    description: 'Пятая версия. Художественный стиль, эстетика.',
    bestFor: 'Арт, концепт-арт, красивые картинки',
    tokensCost: 45,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'midjourney/midjourney-v5.2'
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
    modelId: 'midjourney/midjourney-v6'
  },
  // Stability AI
  'stable-diffusion': {
    name: 'Stable Diffusion XL',
    provider: 'Stability',
    type: 'image',
    description: 'Open-source классика. Гибкая, мощная.',
    bestFor: 'Кастомизация, fine-tuning, вариации',
    tokensCost: 25,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'stabilityai/stable-diffusion-xl-base-1.0'
  },
  // Kandinsky (Сбер)
  'kandinsky-2-1': {
    name: 'Kandinsky 2.1',
    provider: 'Sber',
    type: 'image',
    description: 'Ранняя версия. Базовая генерация.',
    bestFor: 'Простые картинки, история',
    tokensCost: 15,
    complexity: 'basic',
    icon: '🎨',
    modelId: 'sberbank-ai/kandinsky-2-1'
  },
  'kandinsky-2-2': {
    name: 'Kandinsky 2.2',
    provider: 'Sber',
    type: 'image',
    description: 'Улучшенная версия. Лучшее качество.',
    bestFor: 'Стандартные задачи, русский контекст',
    tokensCost: 18,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'sberbank-ai/kandinsky-2-2'
  },
  'kandinsky-3-0': {
    name: 'Kandinsky 3.0',
    provider: 'Sber',
    type: 'image',
    description: 'Третье поколение. Высокое разрешение.',
    bestFor: 'Детальные изображения, профессиональный арт',
    tokensCost: 22,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'sberbank-ai/kandinsky-3'
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
    modelId: 'sberbank-ai/kandinsky-3.1'
  },
  // Другие генераторы изображений
  'leonardo-ai': {
    name: 'Leonardo.Ai',
    provider: 'Leonardo',
    type: 'image',
    description: 'Специализированный инструмент. Игры, концепт-арт.',
    bestFor: 'Game dev, персонажи, окружение',
    tokensCost: 35,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'leonardoai/leonardo-diffusion'
  },
  'ideogram-1-0': {
    name: 'Ideogram 1.0',
    provider: 'Ideogram',
    type: 'image',
    description: 'Генерация с текстом. Логотипы, типографика.',
    bestFor: 'Текст на картинках, логотипы, постеры',
    tokensCost: 30,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'ideogram/ideogram-v1'
  },
  'ideogram-2-0': {
    name: 'Ideogram 2.0',
    provider: 'Ideogram',
    type: 'image',
    description: 'Улучшенная версия. Лучшее качество текста.',
    bestFor: 'Профессиональная типографика, дизайн',
    tokensCost: 35,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'ideogram/ideogram-v2'
  },
  'playground-ai': {
    name: 'Playground AI',
    provider: 'Playground',
    type: 'image',
    description: 'Интуитивный интерфейс. Быстрая генерация.',
    bestFor: 'Быстрые идеи, прототипы, эскизы',
    tokensCost: 28,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'playgroundai/playground-v2.5'
  },
  'adobe-firefly': {
    name: 'Adobe Firefly',
    provider: 'Adobe',
    type: 'image',
    description: 'Безопасная генерация. Коммерческое использование.',
    bestFor: 'Бизнес, маркетинг, безопасный контент',
    tokensCost: 40,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'adobe/firefly-image-2'
  },
  'deepfloyd-if': {
    name: 'DeepFloyd IF',
    provider: 'Stability',
    type: 'image',
    description: 'Каскадная диффузия. Высокая детализация.',
    bestFor: 'Сложные сцены, фотореализм',
    tokensCost: 35,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'deepfloyd/deepfloyd-if'
  },
  'shedevrum': {
    name: 'Шедеврум',
    provider: 'Yandex',
    type: 'image',
    description: 'Русский генератор. Понимает культурный контекст.',
    bestFor: 'Русский арт, локальные сцены, мемы',
    tokensCost: 20,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'yandex/shedevrum'
  },
  'runway-gen-2': {
    name: 'Runway Gen-2',
    provider: 'Runway',
    type: 'image',
    description: 'Мультимодальный. Текст, изображение, видео.',
    bestFor: 'Креативные проекты, микс медиа',
    tokensCost: 30,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'runwayml/gen-2'
  },
  'pixray': {
    name: 'Pixray',
    provider: 'Pixray',
    type: 'image',
    description: 'Open-source инструмент. Гибкий, программируемый.',
    bestFor: 'Эксперименты, кастомизация, кодеры',
    tokensCost: 15,
    complexity: 'basic',
    icon: '🎨',
    modelId: 'pixray/pixray-v2'
  },
  'craiyon': {
    name: 'Craiyon (DALL-E mini)',
    provider: 'Craiyon',
    type: 'image',
    description: 'Бесплатный, быстрый. Низкое качество.',
    bestFor: 'Идеи, эскизы, развлечение',
    tokensCost: 5,
    complexity: 'basic',
    icon: '🎨',
    modelId: 'craiyon/craiyon-v3'
  },
  'dream-wombo': {
    name: 'Dream by Wombo',
    provider: 'Wombo',
    type: 'image',
    description: 'Мобильное приложение. Художественные стили.',
    bestFor: 'Мобильная генерация, арт-фильтры',
    tokensCost: 12,
    complexity: 'basic',
    icon: '🎨',
    modelId: 'wombo/dream-v1'
  },
  'microsoft-designer': {
    name: 'Microsoft Designer',
    provider: 'Microsoft',
    type: 'image',
    description: 'DALL-E 3 в Microsoft. Интеграция с Office.',
    bestFor: 'Бизнес-презентации, документы, маркетинг',
    tokensCost: 40,
    complexity: 'pro',
    icon: '🎨',
    modelId: 'microsoft/designer-dall-e3'
  },
  'bing-image-creator': {
    name: 'Image Creator from Designer (Bing)',
    provider: 'Microsoft',
    type: 'image',
    description: 'Бесплатный DALL-E 3 в Bing. Ограничения.',
    bestFor: 'Бесплатная генерация, быстрые идеи',
    tokensCost: 0,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'microsoft/bing-dall-e3',
    free: true
  },
  'neural-love': {
    name: 'Neural Love',
    provider: 'Neural Love',
    type: 'image',
    description: 'Агрегатор моделей. Несколько стилей.',
    bestFor: 'Вариативность, сравнение моделей',
    tokensCost: 25,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'neurallove/art-generator'
  },
  'hotpot-ai-art': {
    name: 'Hotpot AI Art Generator',
    provider: 'Hotpot',
    type: 'image',
    description: 'Простой инструмент. Быстрые результаты.',
    bestFor: 'Социальные сети, контент, реклама',
    tokensCost: 15,
    complexity: 'basic',
    icon: '🎨',
    modelId: 'hotpot/art-generator'
  },
  'hotpot-ai-logo': {
    name: 'Hotpot AI Logo Generator',
    provider: 'Hotpot',
    type: 'image',
    description: 'Специализация: логотипы. Брендинг.',
    bestFor: 'Логотипы, айдентика, стартапы',
    tokensCost: 20,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'hotpot/logo-generator'
  },
  'starryai': {
    name: 'StarryAI',
    provider: 'StarryAI',
    type: 'image',
    description: 'Мобильное приложение. Художественные стили.',
    bestFor: 'NFT, арт, мобильное творчество',
    tokensCost: 18,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'starryai/starryai-v1'
  },
  'lexica-aperture': {
    name: 'Lexica Aperture v3.5',
    provider: 'Lexica',
    type: 'image',
    description: 'Поиск + генерация. База стилей.',
    bestFor: 'Поиск референсов, стилизация',
    tokensCost: 22,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'lexica/aperture-v3.5'
  },
  'easy-peasy-ai': {
    name: 'Easy-Peasy.AI',
    provider: 'EasyPeasy',
    type: 'image',
    description: 'Простой интерфейс. Шаблоны, пресеты.',
    bestFor: 'Новички, быстрый старт, шаблоны',
    tokensCost: 15,
    complexity: 'basic',
    icon: '🎨',
    modelId: 'easypeasy/image-generator'
  },
  'ai-banner': {
    name: 'AI Banner',
    provider: 'AIBanner',
    type: 'image',
    description: 'Специализация: баннеры. Рекламные форматы.',
    bestFor: 'Реклама, баннеры, маркетинг',
    tokensCost: 20,
    complexity: 'standard',
    icon: '🎨',
    modelId: 'aibanner/banner-generator'
  },
  'scribble-diffusion': {
    name: 'Scribble Diffusion',
    provider: 'Scribble',
    type: 'image',
    description: 'Из скетча в картинку. Рисуй + генерируй.',
    bestFor: 'Скетчи, идеи, быстрые концепты',
    tokensCost: 15,
    complexity: 'basic',
    icon: '🎨',
    modelId: 'scribble/scribble-diffusion'
  },

  // ==================== ВИДЕО ====================
  // OpenAI
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
    upcoming: true
  },
  'sora-2-pro': {
    name: 'Sora 2 Pro',
    provider: 'OpenAI',
    type: 'video',
    description: 'Профессиональная версия. До 5 минут, 4K.',
    bestFor: 'Профессиональное видео, реклама, кино',
    tokensCost: 500,
    complexity: 'ultra',
    icon: '👑',
    modelId: null,
    upcoming: true
  },
  // Runway
  'runway-gen-4-5': {
    name: 'Runway Gen-4.5',
    provider: 'Runway',
    type: 'video',
    description: 'Профессиональная генерация. Motion Brush.',
    bestFor: 'Motion graphics, реклама, дизайн',
    tokensCost: 180,
    complexity: 'ultra',
    icon: '🎬',
    modelId: 'runwayml/gen-4.5',
    upcoming: true
  },
  'runway-gen-3': {
    name: 'Runway Gen-3',
    provider: 'Runway',
    type: 'video',
    description: 'Третье поколение. Улучшенное качество.',
    bestFor: 'Видео-арт, эксперименты, контент',
    tokensCost: 150,
    complexity: 'ultra',
    icon: '🎬',
    modelId: 'runwayml/gen-3',
    upcoming: true
  },
  'runway-aleph': {
    name: 'Runway Aleph',
    provider: 'Runway',
    type: 'video',
    description: 'Будущее поколение. Максимальные возможности.',
    bestFor: 'Кино, премиум-контент, инновации',
    tokensCost: 300,
    complexity: 'ultra',
    icon: '👑',
    modelId: null,
    upcoming: true
  },
  // Pika Labs
  'pika-2-2': {
    name: 'Pika 2.2',
    provider: 'Pika',
    type: 'video',
    description: 'Мультимодальная генерация. Текст, картинка, видео.',
    bestFor: 'Социальные сети, мемы, короткие ролики',
    tokensCost: 120,
    complexity: 'pro',
    icon: '🎬',
    modelId: 'pikalabs/pika-2.2',
    upcoming: true
  },
  'pikalabs-longform': {
    name: 'PikaLabs LongForm',
    provider: 'Pika',
    type: 'video',
    description: 'Длинные видео. До 3 минут, связный сюжет.',
    bestFor: 'Рассказы, презентации, обучение',
    tokensCost: 200,
    complexity: 'ultra',
    icon: '🎬',
    modelId: 'pikalabs/longform',
    upcoming: true
  },
  'pika-mobile-app': {
    name: 'Pika (Mobile App)',
    provider: 'Pika',
    type: 'video',
    description: 'Мобильное приложение. Генерация на телефоне.',
    bestFor: 'Мобильный контент, stories, reels',
    tokensCost: 80,
    complexity: 'standard',
    icon: '🎬',
    modelId: 'pikalabs/mobile',
    upcoming: true
  },
  // Google
  'google-veo-3-1': {
    name: 'Google Veo 3.1',
    provider: 'Google',
    type: 'video',
    description: '1080p, длинные видео. Фотореалистичные сцены.',
    bestFor: 'Профессиональные ролики, реклама',
    tokensCost: 250,
    complexity: 'ultra',
    icon: '🎬',
    modelId: 'google/veo-3.1',
    upcoming: true
  },
  // Другие видео
  'kandinsky-video-1-1': {
    name: 'Kandinsky Video 1.1',
    provider: 'Sber',
    type: 'video',
    description: 'Русский видеогенератор. Понимает локальный контекст.',
    bestFor: 'Русский контент, национальные сцены',
    tokensCost: 100,
    complexity: 'pro',
    icon: '🎬',
    modelId: 'sberbank-ai/kandinsky-video',
    upcoming: true
  },
  'vidu': {
    name: 'Vidu',
    provider: 'ShengShu',
    type: 'video',
    description: 'Китайский генератор. Длинные видео, физика.',
    bestFor: 'Сложные сцены, физически корректное движение',
    tokensCost: 180,
    complexity: 'ultra',
    icon: '🎬',
    modelId: 'shengshu/vidu',
    upcoming: true
  },
  'hailuo-ai': {
    name: 'Hailuo AI',
    provider: 'MiniMax',
    type: 'video',
    description: 'Быстрая генерация. Мультимодальность.',
    bestFor: 'Быстрый контент, прототипы, идеи',
    tokensCost: 120,
    complexity: 'pro',
    icon: '🎬',
    modelId: 'minimax/hailuo',
    upcoming: true
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
    modelId: 'kuaishou/kling',
    upcoming: true
  },
  'kling-2-6': {
    name: 'Kling AI 2.6',
    provider: 'Kuaishou',
    type: 'video',
    description: 'Обновлённая версия. Улучшенное качество.',
    bestFor: 'Современное видео, профессиональный уровень',
    tokensCost: 200,
    complexity: 'ultra',
    icon: '🎬',
    modelId: 'kuaishou/kling-2.6',
    upcoming: true
  },
  'kling-2-5-turbo': {
    name: 'Kling 2.5 Turbo',
    provider: 'Kuaishou',
    type: 'video',
    description: 'Быстрая версия. Скорость + качество.',
    bestFor: 'Быстрая итерация, прототипирование',
    tokensCost: 140,
    complexity: 'pro',
    icon: '🎬',
    modelId: 'kuaishou/kling-2.5-turbo',
    upcoming: true
  },
  'study24-ai': {
    name: 'STUDY24 AI',
    provider: 'STUDY24',
    type: 'video',
    description: 'Образовательный фокус. Обучающие видео.',
    bestFor: 'Курсы, туториалы, образование',
    tokensCost: 100,
    complexity: 'standard',
    icon: '🎬',
    modelId: 'study24/video-generator',
    upcoming: true
  },
    'synthesia-extended': {
    name: 'Synthesia Extended',
    provider: 'Synthesia',
    type: 'video',
    description: 'Аватары + длинные видео. Персонализированный контент.',
    bestFor: 'Корпоративное обучение, презентации, маркетинг',
    tokensCost: 150,
    complexity: 'pro',
    icon: '🎬',
    modelId: 'synthesia/extended',
    upcoming: true
  },
  'deepbrain-longplay': {
    name: 'DeepBrain LongPlay',
    provider: 'DeepBrain',
    type: 'video',
    description: 'AI-ведущие + длинные форматы. Новости, шоу.',
    bestFor: 'Медиа, новости, развлекательный контент',
    tokensCost: 180,
    complexity: 'pro',
    icon: '🎬',
    modelId: 'deepbrain/longplay',
    upcoming: true
  },
  'hourai-studio': {
    name: 'HourAI Studio',
    provider: 'HourAI',
    type: 'video',
    description: 'Профессиональная студия. Полный контроль.',
    bestFor: 'Кино, реклама, премиум-контент',
    tokensCost: 250,
    complexity: 'ultra',
    icon: '👑',
    modelId: 'hourai/studio',
    upcoming: true
  },
  'vidcraft-pro': {
    name: 'VidCraft Pro',
    provider: 'VidCraft',
    type: 'video',
    description: 'Редактор + генерация. All-in-one инструмент.',
    bestFor: 'Монтаж, пост-продакшн, контент-криейторы',
    tokensCost: 120,
    complexity: 'pro',
    icon: '🎬',
    modelId: 'vidcraft/pro',
    upcoming: true
  },
  'flexclip': {
    name: 'FlexClip',
    provider: 'FlexClip',
    type: 'video',
    description: 'Простой онлайн-редактор. Шаблоны, сток.',
    bestFor: 'Маркетинг, социальные сети, быстрые ролики',
    tokensCost: 60,
    complexity: 'standard',
    icon: '🎬',
    modelId: 'flexclip/ai-generator',
    upcoming: true
  },
  'heygen': {
    name: 'HeyGen',
    provider: 'HeyGen',
    type: 'video',
    description: 'AI-аватары + озвучка. Мультиязычность.',
    bestFor: 'Локализация, обучение, маркетинг',
    tokensCost: 100,
    complexity: 'pro',
    icon: '🎬',
    modelId: 'heygen/video-generator',
    upcoming: true
  },
  'viggle-ai': {
    name: 'Viggle AI',
    provider: 'Viggle',
    type: 'video',
    description: 'Анимация персонажей. Движение из видео.',
    bestFor: 'Мемы, анимация, развлечения',
    tokensCost: 80,
    complexity: 'standard',
    icon: '🎬',
    modelId: 'viggle/viggle-ai',
    upcoming: true
  },
  'ai-videogen': {
    name: 'AI VideoGen',
    provider: 'VideoGen',
    type: 'video',
    description: 'Универсальный генератор. Текст в видео.',
    bestFor: 'Быстрая генерация, идеи, прототипы',
    tokensCost: 70,
    complexity: 'standard',
    icon: '🎬',
    modelId: 'videogen/ai-generator',
    upcoming: true
  }
};

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

export function getModelById(modelId) {
  return MODEL_CATALOG[modelId] || MODEL_CATALOG['gpt-4o-mini'];
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
    .filter(([_, model]) => !model.upcoming && !model.legacy)
    .map(([id, model]) => ({ id, ...model }));
}

// ==================== РОУТИНГ ЗАПРОСОВ ====================

export async function routeRequest(userMessage, preferredModel = null) {
  const lowerMsg = userMessage.toLowerCase();
  
  // Если модель выбрана вручную
  if (preferredModel && MODEL_CATALOG[preferredModel]) {
    const model = MODEL_CATALOG[preferredModel];
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
      unavailable: model.upcoming || model.legacy || !model.modelId
    };
  }
  
  // Автоопределение типа запроса
  let requestType = 'text';
  
  if (lowerMsg.includes('код') || lowerMsg.includes('python') || lowerMsg.includes('javascript') || 
      lowerMsg.includes('программ') || lowerMsg.includes('функция') || lowerMsg.includes('класс')) {
    requestType = 'code';
  } else if (lowerMsg.includes('изображение') || lowerMsg.includes('картинк') || 
             lowerMsg.includes('фото') || lowerMsg.includes('нарисуй') || lowerMsg.includes('арт')) {
    requestType = 'image';
  } else if (lowerMsg.includes('видео') || lowerMsg.includes('ролик') || 
             lowerMsg.includes('снять') || lowerMsg.includes('фильм')) {
    requestType = 'video';
  } else if (lowerMsg.includes('объясни подробно') || lowerMsg.includes('распиши') || 
             lowerMsg.includes('детально') || lowerMsg.includes('анализ')) {
    requestType = 'detailed';
  } else if (lowerMsg.includes('привет') || lowerMsg.includes('как дела') || 
             lowerMsg.includes('спасибо') || lowerMsg.includes('пока')) {
    requestType = 'emotional';
  }
  
  // Выбор модели по типу и сложности
  let selectedModel = null;
  
  if (requestType === 'code') {
    selectedModel = MODEL_CATALOG['deepseek-coder-v2'] || 
                    MODEL_CATALOG['codestral'] || 
                    MODEL_CATALOG['claude-code'] || 
                    MODEL_CATALOG['gpt-4o'];
  } else if (requestType === 'image') {
    selectedModel = MODEL_CATALOG['dall-e-3'] || 
                    MODEL_CATALOG['midjourney-v6'] || 
                    MODEL_CATALOG['kandinsky-3-1'] || 
                    MODEL_CATALOG['stable-diffusion'];
  } else if (requestType === 'video') {
    selectedModel = MODEL_CATALOG['sora-2'] || 
                    MODEL_CATALOG['runway-gen-4-5'] || 
                    MODEL_CATALOG['kling-ai'];
  } else if (lowerMsg.length > 800) {
    selectedModel = MODEL_CATALOG['claude-opus-4'] || 
                    MODEL_CATALOG['o1'] || 
                    MODEL_CATALOG['deepseek-r1'] || 
                    MODEL_CATALOG['gpt-4o'];
  } else if (lowerMsg.length > 300) {
    selectedModel = MODEL_CATALOG['gpt-4o'] || 
                    MODEL_CATALOG['claude-sonnet-3.7'] || 
                    MODEL_CATALOG['deepseek-v3'];
  } else {
    selectedModel = MODEL_CATALOG['gpt-4o-mini'] || 
                    MODEL_CATALOG['gemini-2.5-flash'] || 
                    MODEL_CATALOG['mistral-small'];
  }
  
  // Если модель недоступна
  if (!selectedModel?.modelId || selectedModel.upcoming || selectedModel.legacy) {
    return {
      modelId: Object.keys(MODEL_CATALOG).find(key => MODEL_CATALOG[key] === selectedModel) || 'unavailable',
      modelName: selectedModel?.name || 'Модель недоступна',
      provider: selectedModel?.provider || 'N/A',
      requestType: requestType,
      complexity: selectedModel?.complexity || 'standard',
      tokensRequired: selectedModel?.tokensCost || 50,
      description: selectedModel?.description || 'Требуется API доступ',
      icon: selectedModel?.icon || '⚠️',
      bestFor: selectedModel?.bestFor || 'Недоступно',
      unavailable: true
    };
  }
  
  return {
    modelId: Object.keys(MODEL_CATALOG).find(key => MODEL_CATALOG[key] === selectedModel),
    modelName: selectedModel.name,
    provider: selectedModel.provider,
    requestType: requestType,
    complexity: selectedModel.complexity,
    tokensRequired: selectedModel.tokensCost,
    description: selectedModel.description,
    icon: selectedModel.icon,
    bestFor: selectedModel.bestFor
  };
}

// ==================== СИСТЕМНЫЕ ПРОМПТЫ ====================

export function getSystemPromptForType(requestType, isVip, modelProvider = 'OpenAI') {
  const vipNote = isVip ? " Пользователь VIP — отвечай максимально полно и качественно, без ограничений по длине." : "";
  
  const basePrompts = {
    text: `Ты — CerberAI, мощный ИИ-ассистент на базе передовых нейросетей. Пиши грамотно, чётко, по существу. Используй Markdown для форматирования. Отвечай на русском языке, если не указано иное.${vipNote}`,
    code: `Ты — CerberAI, эксперт-программист. Пиши чистый, оптимизированный код с комментариями на русском. Объясняй сложные моменты. Поддерживаешь все языки программирования.${vipNote}`,
    image: `Ты — CerberAI, помощник по генерации изображений. Опиши, что ты создашь, и какие детали учтёшь. Дай советы по улучшению промпта.${vipNote}`,
    video: `Ты — CerberAI, видео-ассистент. Опиши концепцию видео, сценарий, длительность. Дай рекомендации по production.${vipNote}`,
    detailed: `Ты — CerberAI, аналитик. Давай развёрнутые, структурированные ответы с примерами, списками, разделами. Глубокий анализ темы.${vipNote}`,
    emotional: `Ты — CerberAI, дружелюбный собеседник. Общайся тепло, естественно, с юмором. Поддерживай разговор, задавай уточняющие вопросы. Создатель — Каин Сумрак, поддержка: @Ivanka58.${vipNote}`
  };
  
  const providerNotes = {
    'DeepSeek': ' Ты особенно силен в математике, коде и логике.',
    'xAI': ' У тебя есть чувство юмора, доступ к актуальной информации и остроумие.',
    'Anthropic': ' Ты ценишь безопасность, этику и точность в ответах.',
    'Google': ' Ты мультимодален, с широкими знаниями и быстрым поиском.',
    'Mistral': ' Ты европейская альтернатива, независимый и мощный.',
    'Yandex': ' Ты отлично понимаешь русский контекст, культуру и нюансы.',
    'Sber': ' Ты надёжен для бизнес-задач, корпоративного сектора.',
    'Midjourney': ' Ты художник, создаёшь эстетичные, красивые работы.',
    'Stability': ' Ты гибкий инструмент для кастомизации и контроля.',
    'Runway': ' Ты профессионал видео, motion graphics и дизайна.',
    'Pika': ' Ты создаёшь динамичный, вирусный контент для соцсетей.',
    'OpenAI': ' Ты флагманский продукт, универсальный и надёжный.'
  };
  
  const basePrompt = basePrompts[requestType] || basePrompts.text;
  const providerNote = providerNotes[modelProvider] || '';
  
  return basePrompt + providerNote;
}

// ==================== ГЕНЕРАЦИЯ ОТВЕТОВ ====================

export async function generateTextResponse(userMessage, history, systemPrompt, route) {
  // Если модель недоступна
  if (route.unavailable) {
    return `${route.icon} *${route.modelName}*\n\n${route.description}\n\n⚠️ Эта модель ${route.upcoming ? 'в разработке' : 'устарела'} и временно недоступна.\n\nПопробуйте: /models — выбрать другую модель\nПоддержка: @Ivanka58`;
  }
  
  // Подготовка сообщений
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-15), // Последние 15 сообщений контекста
    { role: 'user', content: userMessage }
  ];
  
  // Вызов API через OpenRouter
  try {
    const result = await askAI(messages, route.modelId);
    
    if (!result.success) {
      // Fallback на резервную модель
      console.error('Primary model failed:', result.error);
      const fallback = await askAI(messages, 'openai/gpt-4o-mini');
      if (fallback.success) {
        return fallback.content + '\n\n_(⚠️ Ответ от резервной модели из-за технических проблем)_';
      }
      throw new Error('Все модели недоступны: ' + result.error);
    }
    
    return result.content;
  } catch (error) {
    console.error('Generation error:', error);
    return `⚠️ Ошибка генерации: ${error.message}\n\nПопробуйте позже или выберите другую модель командой /models`;
  }
}

// Генерация изображений
export async function generateImageResponse(prompt, modelId = 'dall-e-3') {
  const model = MODEL_CATALOG[modelId];
  
  if (!model || model.upcoming || model.legacy || !model.modelId) {
    return {
      success: false,
      model: model?.name || 'Unknown',
      error: 'Генерация изображений через этот API недоступна. Используйте веб-версии сервисов.',
      placeholder: true
    };
  }
  
  // Здесь будет реальная генерация через OpenRouter или прямой API
  return {
    success: false,
    model: model.name,
    error: 'Генерация изображений в разработке. Подключение API требует отдельной настройки.',
    placeholder: true
  };
}

// Генерация видео
export async function generateVideoResponse(prompt, modelId = 'sora-2') {
  const model = MODEL_CATALOG[modelId];
  
  return {
    success: false,
    model: model?.name || 'Unknown',
    error: 'Видеогенерация доступна только через официальные сайты. API ограничен.',
    placeholder: true,
    links: {
      'Sora': 'https://openai.com/sora',
      'Runway': 'https://runwayml.com',
      'Kling': 'https://klingai.com',
      'Pika': 'https://pika.art'
    }
  };
}

// ==================== МЕНЮ МОДЕЛЕЙ ====================

export function getModelsForMenu() {
  const categories = {
    '⚡ Быстрые и дешёвые': [
      'gpt-4o-mini', 'gemini-2.5-flash', 'mistral-small', 'claude-haiku-3.5',
      'ministral-3b', 'ministral-8b', 'gigachat-2-lite', 'yandexgpt-3-lite'
    ],
    '🧠 Умные (стандарт)': [
      'gpt-4o', 'claude-sonnet-3.7', 'deepseek-v3', 'gemini-2.5-pro',
      'mistral-large-3', 'grok-2', 'yandexgpt-4-pro', 'gigachat-2-pro'
    ],
    '⭐ Гении (сложные задачи)': [
      'claude-opus-4', 'o1', 'o3-mini', 'deepseek-r1', 'gpt-4', 'grok-3'
    ],
    '💻 Для кода': [
      'deepseek-coder-v2', 'codestral', 'claude-code', 'gpt-4o', 'claude-sonnet-3.7'
    ],
    '🎨 Изображения': [
      'dall-e-3', 'midjourney-v6', 'stable-diffusion', 'kandinsky-3-1',
      'leonardo-ai', 'ideogram-2-0', 'shedevrum'
    ],
    '🎬 Видео (API ограничено)': [
      'sora-2', 'runway-gen-4-5', 'kling-ai', 'pika-2-2', 'vidu'
    ],
    '🇷🇺 Русские модели': [
      'yandexgpt-4-pro', 'yandexgpt-5-pro', 'gigachat-2-max', 'gigachat-3-702b-a36b-ultra',
      'kandinsky-3-1', 'shedevrum'
    ],
    '🔬 Научные/Reasoning': [
      'o1', 'o3-mini', 'deepseek-r1', 'deepseek-math-7b', 'deepseek-prover-v2-671b',
      'gemini-3.0-deep-think'
    ],
    '📜 Исторические': [
      'gpt-1', 'gpt-2', 'dall-e-1'
    ],
    '👑 Будущие (ожидаются)': [
      'gpt-5', 'gpt-5-pro', 'claude-opus-4.6', 'grok-5', 'sora-2-pro',
      'gemini-3.0-pro', 'yandexgpt-5.1-pro', 'deepseek-v3.2-speciale'
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
        description: model.description.slice(0, 50) + '...',
        available: !model.upcoming && !model.legacy && !!model.modelId
      } : null;
    }).filter(Boolean)
  }));
}

// ==================== СТАТИСТИКА ====================

export function getModelsStats() {
  const all = Object.values(MODEL_CATALOG);
  return {
    total: all.length,
    available: all.filter(m => !m.upcoming && !m.legacy && m.modelId).length,
    upcoming: all.filter(m => m.upcoming).length,
    legacy: all.filter(m => m.legacy).length,
    byType: {
      chat: all.filter(m => m.type === 'chat').length,
      code: all.filter(m => m.type === 'code').length,
      image: all.filter(m => m.type === 'image').length,
      video: all.filter(m => m.type === 'video').length,
      vision: all.filter(m => m.type === 'vision').length,
      math: all.filter(m => m.type === 'math').length,
      document: all.filter(m => m.type === 'document').length
    },
    byProvider: [...new Set(all.map(m => m.provider))].length
  };
}
