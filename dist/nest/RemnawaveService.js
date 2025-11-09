"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RemnawaveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemnawaveService = void 0;
const common_1 = require("@nestjs/common");
const RemnawaveClient_1 = require("../client/RemnawaveClient");
const RemnawaveConfig_1 = require("./RemnawaveConfig");
let RemnawaveService = RemnawaveService_1 = class RemnawaveService {
    constructor(options) {
        this.logger = new common_1.Logger(RemnawaveService_1.name);
        // Добавляем логгер если его нет
        const finalOptions = {
            ...options,
            logger: options.logger || {
                debug: (msg, ...args) => this.logger.debug(msg, ...args),
                warn: (msg, ...args) => this.logger.warn(msg, ...args),
                error: (msg, ...args) => this.logger.error(msg, ...args),
            },
        };
        if (!finalOptions.apiToken) {
            throw new Error(`API токен не найден. ` +
                `Для работы с Remnawave API необходимо создать API токен в админ панели ` +
                `и указать его в переменной окружения REM_API_KEY или REM_API_TOKEN. ` +
                `API токены можно создать в разделе "API Tokens" админ панели.`);
        }
        if (!finalOptions.baseUrl) {
            throw new Error('baseUrl обязателен для инициализации RemnawaveService');
        }
        this.client = new RemnawaveClient_1.RemnawaveClient(finalOptions);
    }
    /**
     * Получает информацию о пользователе
     */
    async getUser(query) {
        return this.client.getUser(query);
    }
    /**
     * Получает прямой доступ к клиенту для расширенного использования
     */
    getClient() {
        return this.client;
    }
};
exports.RemnawaveService = RemnawaveService;
exports.RemnawaveService = RemnawaveService = RemnawaveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(RemnawaveConfig_1.REMNAWAVE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], RemnawaveService);
