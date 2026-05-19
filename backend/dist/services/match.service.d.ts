import { IMatch } from '../models/Match';
export declare function getLiveMatches(): Promise<IMatch[]>;
export declare function getScheduledMatches(date?: string): Promise<IMatch[]>;
export declare function getMatchById(id: string): Promise<IMatch | null>;
export declare function updateMatchScore(matchId: string, homeScore: number, awayScore: number, minute: number): Promise<IMatch | null>;
export declare function addTimelineEvent(matchId: string, event: IMatch['timeline'][0]): Promise<IMatch | null>;
export declare function updateMatchStatus(matchId: string, status: IMatch['status']): Promise<IMatch | null>;
//# sourceMappingURL=match.service.d.ts.map