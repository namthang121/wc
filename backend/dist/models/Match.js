"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TimelineEventSchema = new mongoose_1.Schema({
    minute: { type: Number, required: true },
    extraMinute: Number,
    type: {
        type: String,
        enum: ['goal', 'yellow_card', 'red_card', 'substitution', 'var', 'own_goal', 'penalty'],
        required: true,
    },
    team: { type: String, enum: ['home', 'away'], required: true },
    playerName: { type: String, required: true },
    assistName: String,
    substitutePlayerName: String,
    varDecision: String,
    description: String,
}, { _id: false });
const StatPairSchema = { home: { type: Number, default: 0 }, away: { type: Number, default: 0 } };
const MatchSchema = new mongoose_1.Schema({
    externalId: { type: String, required: true, unique: true, index: true },
    homeTeam: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    homePenaltyScore: Number,
    awayPenaltyScore: Number,
    status: { type: String, enum: ['scheduled', 'live', 'halftime', 'finished', 'postponed', 'cancelled'], default: 'scheduled' },
    stage: { type: String, enum: ['group', 'round_of_16', 'quarterfinal', 'semifinal', 'third_place', 'final'], required: true },
    group: String,
    round: String,
    venue: { type: String, required: true },
    city: { type: String, required: true },
    kickoffTime: { type: Date, required: true },
    currentMinute: Number,
    isExtraTime: { type: Boolean, default: false },
    timeline: [TimelineEventSchema],
    statistics: {
        possession: StatPairSchema,
        shots: StatPairSchema,
        shotsOnTarget: StatPairSchema,
        corners: StatPairSchema,
        fouls: StatPairSchema,
        yellowCards: StatPairSchema,
        redCards: StatPairSchema,
        passes: StatPairSchema,
        passAccuracy: StatPairSchema,
        offsides: StatPairSchema,
    },
    aiPrediction: {
        homeWinProbability: Number,
        drawProbability: Number,
        awayWinProbability: Number,
        expectedGoalsHome: Number,
        expectedGoalsAway: Number,
        likelyScorerHome: String,
        likelyScorerAway: String,
    },
}, { timestamps: true });
MatchSchema.index({ status: 1, kickoffTime: 1 });
MatchSchema.index({ homeTeam: 1, awayTeam: 1, kickoffTime: 1 });
exports.Match = mongoose_1.default.model('Match', MatchSchema);
//# sourceMappingURL=Match.js.map