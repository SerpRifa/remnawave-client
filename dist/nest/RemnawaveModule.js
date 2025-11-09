"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RemnawaveModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemnawaveModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const RemnawaveConfig_1 = require("./RemnawaveConfig");
const RemnawaveService_1 = require("./RemnawaveService");
let RemnawaveModule = RemnawaveModule_1 = class RemnawaveModule {
    /**
     * Регистрация модуля с явными опциями
     */
    static register(options) {
        return {
            module: RemnawaveModule_1,
            providers: [
                { provide: RemnawaveConfig_1.REMNAWAVE_OPTIONS, useValue: options },
                RemnawaveService_1.RemnawaveService,
            ],
            exports: [RemnawaveService_1.RemnawaveService],
        };
    }
    /**
     * Регистрация модуля с использованием ConfigService
     * Автоматически получает настройки из переменных окружения
     */
    static forRoot() {
        return {
            module: RemnawaveModule_1,
            imports: [config_1.ConfigModule],
            providers: [
                {
                    provide: RemnawaveConfig_1.REMNAWAVE_OPTIONS,
                    useFactory: (configService) => {
                        const apiToken = configService.get('REM_API_KEY') ||
                            configService.get('REM_API_TOKEN');
                        const baseUrl = configService.get('REM_BASE_URL');
                        if (!apiToken) {
                            throw new Error(`API токен не найден в переменных окружения. ` +
                                `Укажите REM_API_KEY или REM_API_TOKEN.`);
                        }
                        if (!baseUrl) {
                            throw new Error(`baseUrl не найден в переменных окружения. ` +
                                `Укажите REM_BASE_URL.`);
                        }
                        return {
                            apiToken,
                            baseUrl,
                        };
                    },
                    inject: [config_1.ConfigService],
                },
                RemnawaveService_1.RemnawaveService,
            ],
            exports: [RemnawaveService_1.RemnawaveService],
        };
    }
};
exports.RemnawaveModule = RemnawaveModule;
exports.RemnawaveModule = RemnawaveModule = RemnawaveModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], RemnawaveModule);
