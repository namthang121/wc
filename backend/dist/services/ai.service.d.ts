interface AIPrediction {
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    expectedGoalsHome: number;
    expectedGoalsAway: number;
    likelyScorerHome?: string;
    likelyScorerAway?: string;
}
/**
 * Computes AI predictions based on team statistics and historical data.
 * Uses an Elo-inspired rating system + Poisson distribution for xG.
 */
export declare function generateMatchPrediction(matchId: string): Promise<AIPrediction>;
export {};
//# sourceMappingURL=ai.service.d.ts.map