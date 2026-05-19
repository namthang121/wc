import { Request, Response, NextFunction } from 'express';
export declare function cacheMiddleware(ttlSeconds?: number): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cache.middleware.d.ts.map