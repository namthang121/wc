"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENTS = void 0;
// Socket.IO event name constants
exports.SOCKET_EVENTS = {
    // Client → Server
    JOIN_MATCH: 'join_match',
    LEAVE_MATCH: 'leave_match',
    JOIN_STANDINGS: 'join_standings',
    SUBSCRIBE_NOTIFICATIONS: 'subscribe_notifications',
    // Server → Client
    SCORE_UPDATE: 'score_update',
    TIMELINE_EVENT: 'timeline_event',
    STATUS_UPDATE: 'status_update',
    STATS_UPDATE: 'stats_update',
    STANDINGS_UPDATE: 'standings_update',
    NOTIFICATION: 'notification',
    ERROR: 'error',
};
//# sourceMappingURL=events.js.map