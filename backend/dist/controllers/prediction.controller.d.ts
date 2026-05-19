import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const validatePrediction: import("express-validator").ValidationChain[];
export declare function createPrediction(req: AuthRequest, res: Response): Promise<void>;
export declare function getMyPredictions(req: AuthRequest, res: Response): Promise<void>;
export declare function getLeaderboard(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=prediction.controller.d.ts.map