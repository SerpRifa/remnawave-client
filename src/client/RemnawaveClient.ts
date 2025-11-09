import { REST_API } from '@remnawave/backend-contract/build/backend/api/routes';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { RemnawaveLogger, RemnawaveOptions, UserLookupQuery } from '../types/public';

const DEFAULT_TIMEOUT = 10000;

/**
 * Клиент для работы с Remnawave API
 */
export class RemnawaveClient {
  private readonly http: AxiosInstance;
  private readonly logger?: RemnawaveLogger;
  private isAuthenticated = false;
  private accessToken: string | null = null;

  constructor(options: RemnawaveOptions) {
    const {
      apiToken,
      baseUrl,
      timeoutMs = DEFAULT_TIMEOUT,
      logger,
    } = options;

    if (!baseUrl) {
      throw new Error('baseUrl обязателен для инициализации RemnawaveClient');
    }

    this.logger = logger;
    this.accessToken = apiToken;

    this.http = axios.create({
      baseURL: baseUrl,
      timeout: timeoutMs,
    });

    // Настраиваем interceptor для добавления токена в запросы
    this.http.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Настраиваем interceptors для логирования
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.http.interceptors.request.use(
      (config) => {
        this.logger?.debug('Making request', {
          method: config.method?.toUpperCase(),
          url: config.url,
        });
        return config;
      },
      (error) => {
        this.logger?.error('Request error', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.http.interceptors.response.use(
      (response) => {
        this.logger?.debug('Response received', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error: AxiosError) => {
        this.logger?.error('Response error', error as Error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Выполняет запрос с автоматической обработкой ошибок
   */
  private async requestWithRetry<T>(
    requestFn: () => Promise<T>,
    maxRetries = 2,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          this.logger?.debug(`Retry attempt ${attempt}/${maxRetries}`);
        }
        return await requestFn();
      } catch (error) {
        lastError = error as Error;

        if (error instanceof AxiosError) {
          const status = error.response?.status;
          const url = error.config?.url;
          const message =
            error.response?.data?.message ||
            error.message ||
            'Неизвестная ошибка';

          // Если получили 401, сбрасываем флаг и пробуем еще раз
          if (status === 401 && attempt < maxRetries) {
            this.logger?.warn(
              `Получена ошибка 401, попытка повторного запроса (${attempt + 1}/${maxRetries})`,
            );
            this.isAuthenticated = false;
            this.accessToken = null;
            continue;
          }

          // Логируем другие ошибки
          if (status) {
            this.logger?.error(`Ошибка ${status} при запросе ${url}: ${message}`);
          }
        }

        throw error;
      }
    }

    throw lastError || new Error('Неизвестная ошибка при выполнении запроса');
  }

  /**
   * Получает информацию о пользователе
   */
  async getUser(query: UserLookupQuery): Promise<any> {
    const { shortUuid, email, username, uuid, telegramId, tag } = query;
    let url: string | null = null;

    if (shortUuid) {
      url = REST_API.USERS.GET_BY.SHORT_UUID(encodeURIComponent(shortUuid));
    } else if (email) {
      url = REST_API.USERS.GET_BY.EMAIL(encodeURIComponent(email));
    } else if (username) {
      url = REST_API.USERS.GET_BY.USERNAME(encodeURIComponent(username));
    } else if (uuid) {
      url = REST_API.USERS.GET_BY_UUID(encodeURIComponent(uuid));
    } else if (telegramId) {
      url = REST_API.USERS.GET_BY.TELEGRAM_ID(encodeURIComponent(telegramId));
    } else if (tag) {
      url = REST_API.USERS.GET_BY.TAG(encodeURIComponent(tag));
    }

    if (!url) {
      throw new Error(
        'Укажите один из параметров: email | username | uuid | shortUuid | telegramId | tag',
      );
    }

    this.logger?.debug(`Запрос пользователя: ${JSON.stringify(query)}, URL: ${url}`);

    return this.requestWithRetry(async () => {
      const { data } = await this.http.get(url!);
      return data;
    });
  }
}

