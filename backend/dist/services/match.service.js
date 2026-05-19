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
exports.getLiveMatches = getLiveMatches;
exports.getScheduledMatches = getScheduledMatches;
exports.getMatchById = getMatchById;
exports.updateMatchScore = updateMatchScore;
exports.addTimelineEvent = addTimelineEvent;
exports.updateMatchStatus = updateMatchStatus;
const Match_1 = require("../models/Match");
const Standing_1 = require("../models/Standing");
const socket_1 = require("../config/socket");
const notification_service_1 = require("./notification.service");
const logger_1 = require("../utils/logger");
async function getLiveMatches() {
    return Match_1.Match.find({ status: { $in: ['live', 'halftime'] } })
        .populate('homeTeam', 'name code flag logo')
        .populate('awayTeam', 'name code flag logo')
        .sort({ kickoffTime: 1 })
        .lean();
}
async function getScheduledMatches(date) {
    const query = { status: 'scheduled' };
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        query.kickoffTime = { $gte: start, $lte: end };
    }
    return Match_1.Match.find(query)
        .populate('homeTeam', 'name code flag logo')
        .populate('awayTeam', 'name code flag logo')
        .sort({ kickoffTime: 1 })
        .lean();
}
async function getMatchById(id) {
    return Match_1.Match.findById(id)
        .populate('homeTeam')
        .populate('awayTeam')
        .lean();
}
async function updateMatchScore(matchId, homeScore, awayScore, minute) {
    const match = await Match_1.Match.findByIdAndUpdate(matchId, { homeScore, awayScore, currentMinute: minute }, { new: true }).populate('homeTeam awayTeam');
    if (match) {
        const io = (0, socket_1.getIO)();
        io.to(`match:${matchId}`).emit('score_update', {
            matchId,
            homeScore,
            awayScore,
            minute,
        });
    }
    return match;
}
async function addTimelineEvent(matchId, event) {
    const match = await Match_1.Match.findByIdAndUpdate(matchId, { $push: { timeline: event } }, { new: true });
    if (match) {
        const io = (0, socket_1.getIO)();
        io.to(`match:${matchId}`).emit('timeline_event', { matchId, event });
        if (event.type === 'goal' || event.type === 'own_goal' || event.type === 'penalty') {
            await (0, notification_service_1.notifyGoal)(matchId, event.playerName, event.minute);
        }
        else if (event.type === 'red_card') {
            await (0, notification_service_1.notifyRedCard)(matchId, event.playerName, event.minute);
        }
    }
    return match;
}
async function updateMatchStatus(matchId, status) {
    const match = await Match_1.Match.findByIdAndUpdate(matchId, { status }, { new: true })
        .populate('homeTeam awayTeam');
    if (match) {
        const io = (0, socket_1.getIO)();
        io.to(`match:${matchId}`).emit('status_update', { matchId, status });
        if (status === 'live')
            await (0, notification_service_1.notifyMatchStart)(matchId);
        if (status === 'finished') {
            await (0, notification_service_1.notifyMatchEnd)(matchId, match.homeScore, match.awayScore);
            await settleMatchPredictions(matchId, match.homeScore, match.awayScore);
            await updateStandings(match);
        }
    }
    return match;
}
async function settleMatchPredictions(matchId, homeScore, awayScore) {
    const { Prediction } = await Promise.resolve().then(() => __importStar(require('../models/Prediction')));
    const { User } = await Promise.resolve().then(() => __importStar(require('../models/User')));
    const predictions = await Prediction.find({ match: matchId, isSettled: false });
    const bulkOps = [];
    for (const p of predictions) {
        let points = 0;
        const correctResult = (homeScore > awayScore && p.predictedHomeScore > p.predictedAwayScore) ||
            (homeScore < awayScore && p.predictedHomeScore < p.predictedAwayScore) ||
            (homeScore === awayScore && p.predictedHomeScore === p.predictedAwayScore);
        if (p.predictedHomeScore === homeScore && p.predictedAwayScore === awayScore) {
            points = 3; // exact score
        }
        else if (correctResult) {
            points = 1; // correct result
        }
        bulkOps.push({
            updateOne: {
                filter: { _id: p._id },
                update: { pointsEarned: points, isSettled: true },
            },
        });
        if (points > 0) {
            await User.findByIdAndUpdate(p.user, { $inc: { predictionPoints: points } });
        }
    }
    if (bulkOps.length)
        await Prediction.bulkWrite(bulkOps);
    logger_1.logger.info(`Settled ${bulkOps.length} predictions for match ${matchId}`);
}
async function updateStandings(match) {
    if (match.stage !== 'group')
        return;
    const homeGoals = match.homeScore;
    const awayGoals = match.awayScore;
    const homeResult = homeGoals > awayGoals ? 'W' : homeGoals < awayGoals ? 'L' : 'D';
    const awayResult = homeGoals < awayGoals ? 'W' : homeGoals > awayGoals ? 'L' : 'D';
    const updateStanding = async (teamId, gf, ga, result) => {
        const pts = result === 'W' ? 3 : result === 'D' ? 1 : 0;
        await Standing_1.Standing.findOneAndUpdate({ team: teamId }, {
            $inc: {
                played: 1,
                won: result === 'W' ? 1 : 0,
                drawn: result === 'D' ? 1 : 0,
                lost: result === 'L' ? 1 : 0,
                goalsFor: gf,
                goalsAgainst: ga,
                goalDifference: gf - ga,
                points: pts,
            },
            $push: { form: { $each: [result], $slice: -5 } },
        }, { upsert: true });
    };
    await Promise.all([
        updateStanding(match.homeTeam, homeGoals, awayGoals, homeResult),
        updateStanding(match.awayTeam, awayGoals, homeGoals, awayResult),
    ]);
    const io = (0, socket_1.getIO)();
    io.emit('standings_update');
}
//# sourceMappingURL=match.service.js.map