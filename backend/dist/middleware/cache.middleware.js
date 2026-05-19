"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = cacheMiddleware;
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
function cacheMiddleware(ttlSeconds = 60) {
    return async (req, res, next) => {
        const redis = (0, redis_1.getRedisClient)();
        const key = `cache:${req.originalUrl}`;
        try {
            const cached = await redis.get(key);
            if (cached) {
                res.setHeader('X-Cache', 'HIT');
                res.json(JSON.parse(cached));
                return;
            }
        }
        catch (err) {
            logger_1.logger.warn('Redis cache read failed', err);
        }
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            redis.setex(key, ttlSeconds, JSON.stringify(body)).catch((err) => logger_1.logger.warn('Redis cache write failed', err));
            res.setHeader('X-Cache', 'MISS');
            return originalJson(body);
        };
        next();
    };
}
//# sourceMappingURL=cache.middleware.js.map