import { DynamicModule } from '@nestjs/common';
import { RemnawaveOptions } from '../types/public';
export declare class RemnawaveModule {
    /**
     * Регистрация модуля с явными опциями
     */
    static register(options: RemnawaveOptions): DynamicModule;
    /**
     * Регистрация модуля с использованием ConfigService
     * Автоматически получает настройки из переменных окружения
     */
    static forRoot(): DynamicModule;
}
