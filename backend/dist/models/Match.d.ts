import mongoose, { Document } from 'mongoose';
export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed' | 'cancelled';
export type MatchStage = 'group' | 'round_of_16' | 'quarterfinal' | 'semifinal' | 'third_place' | 'final';
export interface ITimelineEvent {
    minute: number;
    extraMinute?: number;
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var' | 'own_goal' | 'penalty';
    team: 'home' | 'away';
    playerName: string;
    assistName?: string;
    substitutePlayerName?: string;
    varDecision?: string;
    description?: string;
}
export interface IMatchStatistics {
    possession: {
        home: number;
        away: number;
    };
    shots: {
        home: number;
        away: number;
    };
    shotsOnTarget: {
        home: number;
        away: number;
    };
    corners: {
        home: number;
        away: number;
    };
    fouls: {
        home: number;
        away: number;
    };
    yellowCards: {
        home: number;
        away: number;
    };
    redCards: {
        home: number;
        away: number;
    };
    passes: {
        home: number;
        away: number;
    };
    passAccuracy: {
        home: number;
        away: number;
    };
    offsides: {
        home: number;
        away: number;
    };
}
export interface IMatch extends Document {
    _id: mongoose.Types.ObjectId;
    externalId: string;
    homeTeam: mongoose.Types.ObjectId;
    awayTeam: mongoose.Types.ObjectId;
    homeScore: number;
    awayScore: number;
    homePenaltyScore?: number;
    awayPenaltyScore?: number;
    status: MatchStatus;
    stage: MatchStage;
    group?: string;
    round?: string;
    venue: string;
    city: string;
    kickoffTime: Date;
    currentMinute?: number;
    isExtraTime: boolean;
    timeline: ITimelineEvent[];
    statistics: IMatchStatistics;
    aiPrediction?: {
        homeWinProbability: number;
        drawProbability: number;
        awayWinProbability: number;
        expectedGoalsHome: number;
        expectedGoalsAway: number;
        likelyScorerHome?: string;
        likelyScorerAway?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Match: mongoose.Model<IMatch, {}, {}, {}, mongoose.Document<unknown, {}, IMatch, {}, {}> & IMatch & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Match.d.ts.map