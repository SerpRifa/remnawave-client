/**
 * Опции для инициализации RemnawaveClient
 */
export interface RemnawaveOptions {
  /** API токен для аутентификации */
  apiToken: string;
  /** Базовый URL API */
  baseUrl: string;
  /** Таймаут запросов в миллисекундах (по умолчанию 10000) */
  timeoutMs?: number;
  /** Логгер для отладки */
  logger?: RemnawaveLogger;
}

/**
 * Интерфейс логгера
 */
export interface RemnawaveLogger {
  debug(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

/**
 * Параметры для поиска пользователя
 */
export interface UserLookupQuery {
  email?: string;
  username?: string;
  uuid?: string;
  shortUuid?: string;
  telegramId?: string;
  tag?: string;
}

