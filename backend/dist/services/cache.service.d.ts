export declare function cacheSet(key: string, value: unknown, ttl?: number): Promise<void>;
export declare function cacheGet<T>(key: string): Promise<T | null>;
export declare function cacheInvalidate(pattern: string): Promise<void>;
//# sourceMappingURL=cache.service.d.ts.map