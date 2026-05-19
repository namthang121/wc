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
exports.validatePrediction = void 0;
exports.createPrediction = createPrediction;
exports.getMyPredictions = getMyPredictions;
exports.getLeaderboard = getLeaderboard;
const express_validator_1 = require("express-validator");
const predictionService = __importStar(require("../services/prediction.service"));
exports.validatePrediction = [
    (0, express_validator_1.body)('matchId').isMongoId().withMessage('Valid match ID required'),
    (0, express_validator_1.body)('predictedHomeScore').isInt({ min: 0, max: 20 }),
    (0, express_validator_1.body)('predictedAwayScore').isInt({ min: 0, max: 20 }),
];
async function createPrediction(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }
    try {
        const { matchId, predictedHomeScore, predictedAwayScore } = req.body;
        const prediction = await predictionService.createPrediction(req.user.id, matchId, predictedHomeScore, predictedAwayScore);
        res.status(201).json({ success: true, data: prediction });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create prediction';
        res.status(400).json({ success: false, message });
    }
}
async function getMyPredictions(req, res) {
    const predictions = await predictionService.getUserPredictions(req.user.id);
    res.json({ success: true, data: predictions });
}
async function getLeaderboard(req, res) {
    const page = parseInt(req.query.page ?? '1', 10);
    const limit = Math.min(parseInt(req.query.limit ?? '50', 10), 100);
    const data = await predictionService.getLeaderboard(page, limit);
    res.json({ success: true, data });
}
//# sourceMappingURL=prediction.controller.js.map