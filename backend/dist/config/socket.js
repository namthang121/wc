"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handlers_1 = require("../socket/handlers");
const logger_1 = require("../utils/logger");
let io;
function initializeSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: (process.env.ALLOWED_ORIGINS ?? '').split(','),
            credentials: true,
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
    });
    // Auth middleware for sockets
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(); // allow unauthenticated for live score streaming
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.user = payload;
            next();
        }
        catch {
            next(new Error('Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        logger_1.logger.info(`Socket connected: ${socket.id}`);
        (0, handlers_1.registerMatchHandlers)(io, socket);
        socket.on('disconnect', (reason) => {
            logger_1.logger.info(`Socket disconnected: ${socket.id} – ${reason}`);
        });
    });
    logger_1.logger.info('Socket.IO initialized');
    return io;
}
function getIO() {
    if (!io)
        throw new Error('Socket.IO not initialized');
    return io;
}
//# sourceMappingURL=socket.js.map