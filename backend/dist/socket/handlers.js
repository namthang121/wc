"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMatchHandlers = registerMatchHandlers;
const events_1 = require("./events");
const Match_1 = require("../models/Match");
const logger_1 = require("../utils/logger");
function registerMatchHandlers(io, socket) {
    // Join a specific match room for realtime updates
    socket.on(events_1.SOCKET_EVENTS.JOIN_MATCH, async (matchId) => {
        if (typeof matchId !== 'string' || matchId.length !== 24) {
            socket.emit(events_1.SOCKET_EVENTS.ERROR, { message: 'Invalid match ID' });
            return;
        }
        try {
            const match = await Match_1.Match.findById(matchId)
                .populate('homeTeam', 'name code flag logo')
                .populate('awayTeam', 'name code flag logo')
                .lean();
            if (!match) {
                socket.emit(events_1.SOCKET_EVENTS.ERROR, { message: 'Match not found' });
                return;
            }
            await socket.join(`match:${matchId}`);
            // Send current match state immediately on join
            socket.emit(events_1.SOCKET_EVENTS.SCORE_UPDATE, {
                matchId,
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                minute: match.currentMinute,
                status: match.status,
            });
            logger_1.logger.info(`Socket ${socket.id} joined match:${matchId}`);
        }
        catch (err) {
            logger_1.logger.error('Error joining match room', err);
            socket.emit(events_1.SOCKET_EVENTS.ERROR, { message: 'Failed to join match room' });
        }
    });
    socket.on(events_1.SOCKET_EVENTS.LEAVE_MATCH, (matchId) => {
        socket.leave(`match:${matchId}`);
        logger_1.logger.info(`Socket ${socket.id} left match:${matchId}`);
    });
    // Join standings room for live table updates
    socket.on(events_1.SOCKET_EVENTS.JOIN_STANDINGS, () => {
        socket.join('standings');
        logger_1.logger.info(`Socket ${socket.id} joined standings room`);
    });
    // Subscribe to personalized notifications
    socket.on(events_1.SOCKET_EVENTS.SUBSCRIBE_NOTIFICATIONS, (userId) => {
        if (typeof userId === 'string' && userId.length === 24) {
            socket.join(`user:${userId}`);
            logger_1.logger.info(`Socket ${socket.id} subscribed to notifications for user ${userId}`);
        }
    });
}
//# sourceMappingURL=handlers.js.map