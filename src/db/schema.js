// Схема базы данных CerberAI

export const users = {
  tableName: 'users',
  columns: {
    id: 'integer',
    telegramId: 'telegram_id',
    username: 'username',
    firstName: 'first_name',
    lastName: 'last_name',
    tokens: 'tokens',
    isVip: 'is_vip',
    isBanned: 'is_banned',
    totalStarsSpent: 'total_stars_spent',
    textTokenLimit: 'text_token_limit',
    imageTokenLimit: 'image_token_limit',
    videoTokenLimit: 'video_token_limit',
    lastDailyBonus: 'last_daily_bonus',
    createdAt: 'created_at'
  }
};

export const chatHistory = {
  tableName: 'chat_history',
  columns: {
    id: 'integer',
    telegramId: 'telegram_id',
    role: 'role',
    content: 'content',
    tokensUsed: 'tokens_used',
    createdAt: 'created_at'
  }
};
