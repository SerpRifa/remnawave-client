"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemnawaveClient = void 0;
const routes_1 = require("@remnawave/backend-contract/build/backend/api/routes");
const axios_1 = __importStar(require("axios"));
const DEFAULT_TIMEOUT = 10000;
/**
 * Клиент для работы с Remnawave API
 */
class RemnawaveClient {
    constructor(options) {
        this.isAuthenticated = false;
        this.accessToken = null;
        const { apiToken, baseUrl, timeoutMs = DEFAULT_TIMEOUT, logger, } = options;
        if (!baseUrl) {
            throw new Error('baseUrl обязателен для инициализации RemnawaveClient');
        }
        this.logger = logger;
        this.accessToken = apiToken;
        this.http = axios_1.default.create({
            baseURL: baseUrl,
            timeout: timeoutMs,
        });
        // Настраиваем interceptor для добавления токена в запросы
        this.http.interceptors.request.use((config) => {
            if (this.accessToken && config.headers) {
                config.headers['Authorization'] = `Bearer ${this.accessToken}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        // Настраиваем interceptors для логирования
        this.setupInterceptors();
    }
    setupInterceptors() {
        // Request interceptor
        this.http.interceptors.request.use((config) => {
            this.logger?.debug('Making request', {
                method: config.method?.toUpperCase(),
                url: config.url,
            });
            return config;
        }, (error) => {
            this.logger?.error('Request error', error);
            return Promise.reject(error);
        });
        // Response interceptor
        this.http.interceptors.response.use((response) => {
            this.logger?.debug('Response received', {
                status: response.status,
                url: response.config.url,
            });
            return response;
        }, (error) => {
            this.logger?.error('Response error', error);
            return Promise.reject(error);
        });
    }
    /**
     * Выполняет запрос с автоматической обработкой ошибок
     */
    async requestWithRetry(requestFn, maxRetries = 2) {
        let lastError = null;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    this.logger?.debug(`Retry attempt ${attempt}/${maxRetries}`);
                }
                return await requestFn();
            }
            catch (error) {
                lastError = error;
                if (error instanceof axios_1.AxiosError) {
                    const status = error.response?.status;
                    const url = error.config?.url;
                    const message = error.response?.data?.message ||
                        error.message ||
                        'Неизвестная ошибка';
                    // Если получили 401, сбрасываем флаг и пробуем еще раз
                    if (status === 401 && attempt < maxRetries) {
                        this.logger?.warn(`Получена ошибка 401, попытка повторного запроса (${attempt + 1}/${maxRetries})`);
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
    async getUser(query) {
        const { shortUuid, email, username, uuid, telegramId, tag } = query;
        let url = null;
        if (shortUuid) {
            url = routes_1.REST_API.USERS.GET_BY.SHORT_UUID(encodeURIComponent(shortUuid));
        }
        else if (email) {
            url = routes_1.REST_API.USERS.GET_BY.EMAIL(encodeURIComponent(email));
        }
        else if (username) {
            url = routes_1.REST_API.USERS.GET_BY.USERNAME(encodeURIComponent(username));
        }
        else if (uuid) {
            url = routes_1.REST_API.USERS.GET_BY_UUID(encodeURIComponent(uuid));
        }
        else if (telegramId) {
            url = routes_1.REST_API.USERS.GET_BY.TELEGRAM_ID(encodeURIComponent(telegramId));
        }
        else if (tag) {
            url = routes_1.REST_API.USERS.GET_BY.TAG(encodeURIComponent(tag));
        }
        if (!url) {
            throw new Error('Укажите один из параметров: email | username | uuid | shortUuid | telegramId | tag');
        }
        this.logger?.debug(`Запрос пользователя: ${JSON.stringify(query)}, URL: ${url}`);
        return this.requestWithRetry(async () => {
            const { data } = await this.http.get(url);
            return data;
        });
    }
}
exports.RemnawaveClient = RemnawaveClient;
