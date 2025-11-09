import { RemnawaveOptions, UserLookupQuery } from '../types/public';
/**
 * Клиент для работы с Remnawave API
 */
export declare class RemnawaveClient {
    private readonly http;
    private readonly logger?;
    private isAuthenticated;
    private accessToken;
    constructor(options: RemnawaveOptions);
    private setupInterceptors;
    /**
     * Выполняет запрос с автоматической обработкой ошибок
     */
    private requestWithRetry;
    /**
     * Получает информацию о пользователе
     */
    getUser(query: UserLookupQuery): Promise<any>;
}
