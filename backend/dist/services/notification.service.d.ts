export declare function notifyMatchStart(matchId: string): Promise<void>;
export declare function notifyGoal(matchId: string, scorer: string, minute: number): Promise<void>;
export declare function notifyRedCard(matchId: string, player: string, minute: number): Promise<void>;
export declare function notifyMatchEnd(matchId: string, homeScore: number, awayScore: number): Promise<void>;
//# sourceMappingURL=notification.service.d.ts.map