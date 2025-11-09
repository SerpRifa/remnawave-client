# @freeinet/remnawave-client

TypeScript клиент и NestJS-модуль для работы с Remnawave API.

## Установка

```bash
npm install @freeinet/remnawave-client
```

## Использование

### В NestJS приложении

#### Вариант 1: Автоматическая конфигурация из переменных окружения

```typescript
import { RemnawaveModule } from '@freeinet/remnawave-client';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RemnawaveModule.forRoot(),
  ],
})
export class AppModule {}
```

Переменные окружения:
```env
REM_API_KEY=your_api_token_here
REM_BASE_URL=https://your-api-url.com  # обязательно
```

#### Вариант 2: Явная конфигурация

```typescript
import { RemnawaveModule } from '@freeinet/remnawave-client';

@Module({
  imports: [
    RemnawaveModule.register({
      apiToken: 'your_api_token_here',
      baseUrl: 'https://your-api-url.com', // обязательно
    }),
  ],
})
export class AppModule {}
```

### Использование сервиса

```typescript
import { RemnawaveService } from '@freeinet/remnawave-client';

@Injectable()
export class MyService {
  constructor(private readonly remnawaveService: RemnawaveService) {}

  async getUser() {
    return this.remnawaveService.getUser({
      shortUuid: 'aP8m-PAscCaBJM0W',
    });
  }
}
```

### Использование клиента напрямую (без NestJS)

```typescript
import { RemnawaveClient } from '@freeinet/remnawave-client';

const client = new RemnawaveClient({
  apiToken: 'your_api_token_here',
  baseUrl: 'https://your-api-url.com', // обязательно
});

const user = await client.getUser({
  shortUuid: 'aP8m-PAscCaBJM0W',
});
```

## API

### RemnawaveService / RemnawaveClient

#### getUser(query: UserLookupQuery): Promise<any>

Получает информацию о пользователе по одному из параметров:

- `shortUuid?: string`
- `email?: string`
- `username?: string`
- `uuid?: string`
- `telegramId?: string`
- `tag?: string`

## Лицензия

MIT

