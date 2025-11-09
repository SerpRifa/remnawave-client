import { RemnawaveClient } from '../client/RemnawaveClient';
import { RemnawaveOptions, UserLookupQuery } from '../types/public';
export declare class RemnawaveService {
    private readonly logger;
    private readonly client;
    constructor(options: RemnawaveOptions);
    /**
     * Получает информацию о пользователе
     */
    getUser(query: UserLookupQuery): Promise<any>;
    /**
     * Получает прямой доступ к клиенту для расширенного использования
     */
    getClient(): RemnawaveClient;
}
