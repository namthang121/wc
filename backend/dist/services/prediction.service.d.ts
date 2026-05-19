import { IPrediction } from '../models/Prediction';
export declare function createPrediction(userId: string, matchId: string, predictedHomeScore: number, predictedAwayScore: number): Promise<IPrediction>;
export declare function getUserPredictions(userId: string): Promise<IPrediction[]>;
export declare function getLeaderboard(page?: number, limit?: number): Promise<unknown[]>;
//# sourceMappingURL=prediction.service.d.ts.map