"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
async function connectDatabase() {
    const uri = process.env.MONGODB_URI;
    if (!uri)
        throw new Error('MONGODB_URI is not defined');
    mongoose_1.default.connection.on('connected', () => logger_1.logger.info('MongoDB connected'));
    mongoose_1.default.connection.on('error', (err) => logger_1.logger.error('MongoDB error', err));
    mongoose_1.default.connection.on('disconnected', () => logger_1.logger.warn('MongoDB disconnected'));
    await mongoose_1.default.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
}
//# sourceMappingURL=database.js.map