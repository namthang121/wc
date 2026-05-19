export declare const SOCKET_EVENTS: {
    readonly JOIN_MATCH: "join_match";
    readonly LEAVE_MATCH: "leave_match";
    readonly JOIN_STANDINGS: "join_standings";
    readonly SUBSCRIBE_NOTIFICATIONS: "subscribe_notifications";
    readonly SCORE_UPDATE: "score_update";
    readonly TIMELINE_EVENT: "timeline_event";
    readonly STATUS_UPDATE: "status_update";
    readonly STATS_UPDATE: "stats_update";
    readonly STANDINGS_UPDATE: "standings_update";
    readonly NOTIFICATION: "notification";
    readonly ERROR: "error";
};
export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
//# sourceMappingURL=events.d.ts.map