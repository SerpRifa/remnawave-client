import { Injectable, Inject, Logger } from '@nestjs/common';
import { RemnawaveClient } from '../client/RemnawaveClient';
import { REMNAWAVE_OPTIONS } from './RemnawaveConfig';
import { RemnawaveOptions, UserLookupQuery } from '../types/public';

@Injectable()
export class RemnawaveService {
  private readonly logger = new Logger(RemnawaveService.name);
  private readonly client: RemnawaveClient;

  constructor(@Inject(REMNAWAVE_OPTIONS) options: RemnawaveOptions) {
    // Добавляем логгер если его нет
    const finalOptions: RemnawaveOptions = {
      ...options,
      logger: options.logger || {
        debug: (msg, ...args) => this.logger.debug(msg, ...args),
        warn: (msg, ...args) => this.logger.warn(msg, ...args),
        error: (msg, ...args) => this.logger.error(msg, ...args),
      },
    };

    if (!finalOptions.apiToken) {
      throw new Error(
        `API токен не найден. ` +
          `Для работы с Remnawave API необходимо создать API токен в админ панели ` +
          `и указать его в переменной окружения REM_API_KEY или REM_API_TOKEN. ` +
          `API токены можно создать в разделе "API Tokens" админ панели.`,
      );
    }

    if (!finalOptions.baseUrl) {
      throw new Error('baseUrl обязателен для инициализации RemnawaveService');
    }

    this.client = new RemnawaveClient(finalOptions);
  }

  /**
   * Получает информацию о пользователе
   */
  async getUser(query: UserLookupQuery): Promise<any> {
    return this.client.getUser(query);
  }

  /**
   * Получает прямой доступ к клиенту для расширенного использования
   */
  getClient(): RemnawaveClient {
    return this.client;
  }
}

