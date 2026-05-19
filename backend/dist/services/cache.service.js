"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheSet = cacheSet;
exports.cacheGet = cacheGet;
exports.cacheInvalidate = cacheInvalidate;
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
async function cacheSet(key, value, ttl = 60) {
    try {
        const redis = (0, redis_1.getRedisClient)();
        await redis.setex(key, ttl, JSON.stringify(value));
    }
    catch (err) {
        logger_1.logger.warn('Cache set failed', err);
    }
}
async function cacheGet(key) {
    try {
        const redis = (0, redis_1.getRedisClient)();
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
    }
    catch (err) {
        logger_1.logger.warn('Cache get failed', err);
        return null;
    }
}
async function cacheInvalidate(pattern) {
    try {
        const redis = (0, redis_1.getRedisClient)();
        const keys = await redis.keys(pattern);
        if (keys.length)
            await redis.del(...keys);
    }
    catch (err) {
        logger_1.logger.warn('Cache invalidate failed', err);
    }
}
//# sourceMappingURL=cache.service.js.map