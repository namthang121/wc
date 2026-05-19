"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../utils/logger");
let redisClient = null;
function getRedisClient() {
    if (!redisClient) {
        const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
        redisClient = new ioredis_1.default(url, {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });
        redisClient.on('connect', () => logger_1.logger.info('Redis connected'));
        redisClient.on('error', (err) => logger_1.logger.error('Redis error', err));
    }
    return redisClient;
}
//# sourceMappingURL=redis.js.map