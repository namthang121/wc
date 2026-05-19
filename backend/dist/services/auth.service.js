"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.refreshTokens = refreshTokens;
exports.registerFcmToken = registerFcmToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
function signAccess(id, role) {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    });
}
function signRefresh(id) {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
    });
}
async function registerUser(username, email, password) {
    const existing = await User_1.User.findOne({ $or: [{ email }, { username }] });
    if (existing)
        throw new Error('Email or username already in use');
    const user = await User_1.User.create({ username, email, password });
    const tokens = {
        accessToken: signAccess(user._id.toString(), user.role),
        refreshToken: signRefresh(user._id.toString()),
    };
    return { user, tokens };
}
async function loginUser(email, password) {
    const user = await User_1.User.findOne({ email, isActive: true }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
    }
    const tokens = {
        accessToken: signAccess(user._id.toString(), user.role),
        refreshToken: signRefresh(user._id.toString()),
    };
    return { user, tokens };
}
async function refreshTokens(refreshToken) {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    }
    catch {
        throw new Error('Invalid refresh token');
    }
    const user = await User_1.User.findById(payload.id).select('_id role isActive');
    if (!user || !user.isActive)
        throw new Error('User not found');
    return {
        accessToken: signAccess(user._id.toString(), user.role),
        refreshToken: signRefresh(user._id.toString()),
    };
}
async function registerFcmToken(userId, token) {
    await User_1.User.findByIdAndUpdate(userId, { $addToSet: { fcmTokens: token } });
    logger_1.logger.info(`FCM token registered for user ${userId}`);
}
//# sourceMappingURL=auth.service.js.map