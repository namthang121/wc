"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./config/database");
const socket_1 = require("./config/socket");
const firebase_1 = require("./config/firebase");
const logger_1 = require("./utils/logger");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const match_routes_1 = __importDefault(require("./routes/match.routes"));
const standing_routes_1 = __importDefault(require("./routes/standing.routes"));
const prediction_routes_1 = __importDefault(require("./routes/prediction.routes"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// ─── Security Middleware ──────────────────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cors_1.default)({
    origin: (process.env.ALLOWED_ORIGINS ?? '').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);
// ─── General Middleware ───────────────────────────────────────────────────────
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'wcjs-backend', timestamp: new Date().toISOString() });
});
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/matches', match_routes_1.default);
app.use('/api/v1/standings', standing_routes_1.default);
app.use('/api/v1/predictions', prediction_routes_1.default);
app.use('/api/v1/news', news_routes_1.default);
app.use('/api/v1/teams', team_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    logger_1.logger.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});
// ─── Bootstrap ───────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '5000', 10);
async function bootstrap() {
    await (0, database_1.connectDatabase)();
    (0, firebase_1.initializeFirebase)();
    (0, socket_1.initializeSocket)(server);
    server.listen(PORT, () => {
        logger_1.logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
}
bootstrap().catch((err) => {
    logger_1.logger.error('Failed to start server', err);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=app.js.map