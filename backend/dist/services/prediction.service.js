"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrediction = createPrediction;
exports.getUserPredictions = getUserPredictions;
exports.getLeaderboard = getLeaderboard;
const Prediction_1 = require("../models/Prediction");
const User_1 = require("../models/User");
const Match_1 = require("../models/Match");
async function createPrediction(userId, matchId, predictedHomeScore, predictedAwayScore) {
    const match = await Match_1.Match.findById(matchId);
    if (!match)
        throw new Error('Match not found');
    if (match.status !== 'scheduled')
        throw new Error('Predictions are closed for this match');
    const existing = await Prediction_1.Prediction.findOne({ user: userId, match: matchId });
    if (existing)
        throw new Error('You have already predicted this match');
    return Prediction_1.Prediction.create({ user: userId, match: matchId, predictedHomeScore, predictedAwayScore });
}
async function getUserPredictions(userId) {
    return Prediction_1.Prediction.find({ user: userId })
        .populate({
        path: 'match',
        populate: [
            { path: 'homeTeam', select: 'name code flag' },
            { path: 'awayTeam', select: 'name code flag' },
        ],
    })
        .sort({ createdAt: -1 });
}
async function getLeaderboard(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    return User_1.User.find({ isActive: true })
        .select('username avatar predictionPoints')
        .sort({ predictionPoints: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
}
//# sourceMappingURL=prediction.service.js.map