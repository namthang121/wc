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
exports.validateLogin = exports.validateRegister = void 0;
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.registerFcm = registerFcm;
exports.toggleFavoriteTeam = toggleFavoriteTeam;
const express_validator_1 = require("express-validator");
const authService = __importStar(require("../services/auth.service"));
const User_1 = require("../models/User");
exports.validateRegister = [
    (0, express_validator_1.body)('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 chars'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars'),
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
];
async function register(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }
    try {
        const { username, email, password } = req.body;
        const { user, tokens } = await authService.registerUser(username, email, password);
        res.status(201).json({
            success: true,
            data: {
                user: { id: user._id, username: user.username, email: user.email, role: user.role },
                ...tokens,
            },
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        res.status(400).json({ success: false, message });
    }
}
async function login(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }
    try {
        const { email, password } = req.body;
        const { user, tokens } = await authService.loginUser(email, password);
        res.json({
            success: true,
            data: {
                user: { id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar },
                ...tokens,
            },
        });
    }
    catch {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
}
async function refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ success: false, message: 'Refresh token required' });
        return;
    }
    try {
        const tokens = await authService.refreshTokens(refreshToken);
        res.json({ success: true, data: tokens });
    }
    catch {
        res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
}
async function getProfile(req, res) {
    const user = await User_1.User.findById(req.user?.id)
        .populate('favoriteTeams', 'name code flag logo')
        .select('-password -fcmTokens');
    res.json({ success: true, data: user });
}
async function updateProfile(req, res) {
    const allowed = ['username', 'avatar', 'notificationPreferences'];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined)
            updates[key] = req.body[key];
    }
    const user = await User_1.User.findByIdAndUpdate(req.user?.id, updates, { new: true, runValidators: true })
        .select('-password -fcmTokens');
    res.json({ success: true, data: user });
}
async function registerFcm(req, res) {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({ success: false, message: 'FCM token required' });
        return;
    }
    await authService.registerFcmToken(req.user.id, token);
    res.json({ success: true, message: 'FCM token registered' });
}
async function toggleFavoriteTeam(req, res) {
    const { teamId } = req.params;
    const user = await User_1.User.findById(req.user?.id);
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    const idx = user.favoriteTeams.findIndex((t) => t.toString() === teamId);
    if (idx === -1) {
        user.favoriteTeams.push(new (await Promise.resolve().then(() => __importStar(require('mongoose')))).default.Types.ObjectId(teamId));
    }
    else {
        user.favoriteTeams.splice(idx, 1);
    }
    await user.save();
    res.json({ success: true, data: { favoriteTeams: user.favoriteTeams } });
}
//# sourceMappingURL=auth.controller.js.map