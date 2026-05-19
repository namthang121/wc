"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyMatchStart = notifyMatchStart;
exports.notifyGoal = notifyGoal;
exports.notifyRedCard = notifyRedCard;
exports.notifyMatchEnd = notifyMatchEnd;
const firebase_1 = require("../config/firebase");
const User_1 = require("../models/User");
const Match_1 = require("../models/Match");
const logger_1 = require("../utils/logger");
async function getTokensForMatch(matchId) {
    const match = await Match_1.Match.findById(matchId).populate('homeTeam awayTeam');
    if (!match)
        return [];
    const teamIds = [match.homeTeam, match.awayTeam];
    const users = await User_1.User.find({
        $or: [
            { favoriteTeams: { $in: teamIds } },
            { favoriteTeams: { $size: 0 } }, // users with no favourites get all notifications
        ],
        fcmTokens: { $exists: true, $not: { $size: 0 } },
    }).select('fcmTokens notificationPreferences');
    return users.flatMap((u) => u.fcmTokens);
}
async function sendMulticast(tokens, title, body, data) {
    if (!tokens.length)
        return;
    if (!firebase_1.admin.apps.length) {
        logger_1.logger.warn('Firebase not initialized, skipping notification');
        return;
    }
    const chunks = [];
    for (let i = 0; i < tokens.length; i += 500) {
        chunks.push(tokens.slice(i, i + 500));
    }
    for (const chunk of chunks) {
        try {
            const response = await firebase_1.admin.messaging().sendEachForMulticast({
                tokens: chunk,
                notification: { title, body },
                data,
                android: { priority: 'high', notification: { sound: 'default', channelId: 'wcjs_channel' } },
            });
            logger_1.logger.info(`FCM: sent=${response.successCount} failed=${response.failureCount}`);
        }
        catch (err) {
            logger_1.logger.error('FCM multicast error', err);
        }
    }
}
async function notifyMatchStart(matchId) {
    const tokens = await getTokensForMatch(matchId);
    const match = await Match_1.Match.findById(matchId).populate('homeTeam awayTeam');
    if (!match)
        return;
    const ht = match.homeTeam.name;
    const at = match.awayTeam.name;
    await sendMulticast(tokens, '⚽ Match Starting Now!', `${ht} vs ${at} is kicking off!`, { type: 'match_start', matchId });
}
async function notifyGoal(matchId, scorer, minute) {
    const tokens = await getTokensForMatch(matchId);
    await sendMulticast(tokens, '⚽ GOAL!', `${scorer} scores in minute ${minute}!`, { type: 'goal', matchId });
}
async function notifyRedCard(matchId, player, minute) {
    const tokens = await getTokensForMatch(matchId);
    await sendMulticast(tokens, '🟥 Red Card!', `${player} has been sent off in minute ${minute}!`, { type: 'red_card', matchId });
}
async function notifyMatchEnd(matchId, homeScore, awayScore) {
    const tokens = await getTokensForMatch(matchId);
    const match = await Match_1.Match.findById(matchId).populate('homeTeam awayTeam');
    if (!match)
        return;
    const ht = match.homeTeam.name;
    const at = match.awayTeam.name;
    await sendMulticast(tokens, '🏁 Final Whistle!', `${ht} ${homeScore} - ${awayScore} ${at}`, { type: 'match_end', matchId });
}
//# sourceMappingURL=notification.service.js.map