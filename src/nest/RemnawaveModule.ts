import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RemnawaveOptions } from '../types/public';
import { REMNAWAVE_OPTIONS } from './RemnawaveConfig';
import { RemnawaveService } from './RemnawaveService';

@Global()
@Module({})
export class RemnawaveModule {
  /**
   * Регистрация модуля с явными опциями
   */
  static register(options: RemnawaveOptions): DynamicModule {
    return {
      module: RemnawaveModule,
      providers: [
        { provide: REMNAWAVE_OPTIONS, useValue: options },
        RemnawaveService,
      ],
      exports: [RemnawaveService],
    };
  }

  /**
   * Регистрация модуля с использованием ConfigService
   * Автоматически получает настройки из переменных окружения
   */
  static forRoot(): DynamicModule {
    return {
      module: RemnawaveModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: REMNAWAVE_OPTIONS,
          useFactory: (configService: ConfigService) => {
            const apiToken =
              configService.get<string>('REM_API_KEY') ||
              configService.get<string>('REM_API_TOKEN');
            const baseUrl = configService.get<string>('REM_BASE_URL');

            if (!apiToken) {
              throw new Error(
                `API токен не найден в переменных окружения. ` +
                  `Укажите REM_API_KEY или REM_API_TOKEN.`,
              );
            }

            if (!baseUrl) {
              throw new Error(
                `baseUrl не найден в переменных окружения. ` +
                  `Укажите REM_BASE_URL.`,
              );
            }

            return {
              apiToken,
              baseUrl,
            } as RemnawaveOptions;
          },
          inject: [ConfigService],
        },
        RemnawaveService,
      ],
      exports: [RemnawaveService],
    };
  }
}

