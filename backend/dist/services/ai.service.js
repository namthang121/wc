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
exports.generateMatchPrediction = generateMatchPrediction;
const Match_1 = require("../models/Match");
const logger_1 = require("../utils/logger");
/**
 * Computes AI predictions based on team statistics and historical data.
 * Uses an Elo-inspired rating system + Poisson distribution for xG.
 */
async function generateMatchPrediction(matchId) {
    const match = await Match_1.Match.findById(matchId).populate('homeTeam awayTeam');
    if (!match)
        throw new Error('Match not found');
    const { Standing } = await Promise.resolve().then(() => __importStar(require('../models/Standing')));
    const [homeStanding, awayStanding] = await Promise.all([
        Standing.findOne({ team: match.homeTeam }),
        Standing.findOne({ team: match.awayTeam }),
    ]);
    // Compute attack / defence strength coefficients
    const leagueAvgGoals = 2.5;
    const homeAttack = homeStanding && homeStanding.played > 0
        ? (homeStanding.goalsFor / homeStanding.played) / leagueAvgGoals
        : 1;
    const homeDefence = homeStanding && homeStanding.played > 0
        ? (homeStanding.goalsAgainst / homeStanding.played) / leagueAvgGoals
        : 1;
    const awayAttack = awayStanding && awayStanding.played > 0
        ? (awayStanding.goalsFor / awayStanding.played) / leagueAvgGoals
        : 1;
    const awayDefence = awayStanding && awayStanding.played > 0
        ? (awayStanding.goalsAgainst / awayStanding.played) / leagueAvgGoals
        : 1;
    const homeAdvantage = 1.15;
    const expectedGoalsHome = Math.max(0.1, homeAttack * awayDefence * leagueAvgGoals * homeAdvantage);
    const expectedGoalsAway = Math.max(0.1, awayAttack * homeDefence * leagueAvgGoals);
    // Poisson probability mass function
    function poissonPmf(k, lambda) {
        return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
    }
    function factorial(n) {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }
    let homeWin = 0, draw = 0, awayWin = 0;
    const maxGoals = 8;
    for (let h = 0; h <= maxGoals; h++) {
        for (let a = 0; a <= maxGoals; a++) {
            const prob = poissonPmf(h, expectedGoalsHome) * poissonPmf(a, expectedGoalsAway);
            if (h > a)
                homeWin += prob;
            else if (h === a)
                draw += prob;
            else
                awayWin += prob;
        }
    }
    const total = homeWin + draw + awayWin;
    const prediction = {
        homeWinProbability: Math.round((homeWin / total) * 100),
        drawProbability: Math.round((draw / total) * 100),
        awayWinProbability: Math.round((awayWin / total) * 100),
        expectedGoalsHome: Math.round(expectedGoalsHome * 10) / 10,
        expectedGoalsAway: Math.round(expectedGoalsAway * 10) / 10,
    };
    // Top scorer from roster
    const homeTeamDoc = match.homeTeam;
    const awayTeamDoc = match.awayTeam;
    if (homeTeamDoc.players?.length) {
        const topScorer = homeTeamDoc.players.reduce((a, b) => (a.goals > b.goals ? a : b));
        prediction.likelyScorerHome = topScorer.name;
    }
    if (awayTeamDoc.players?.length) {
        const topScorer = awayTeamDoc.players.reduce((a, b) => (a.goals > b.goals ? a : b));
        prediction.likelyScorerAway = topScorer.name;
    }
    // Persist prediction
    await Match_1.Match.findByIdAndUpdate(matchId, { aiPrediction: prediction });
    logger_1.logger.info(`AI prediction generated for match ${matchId}`);
    return prediction;
}
//# sourceMappingURL=ai.service.js.map