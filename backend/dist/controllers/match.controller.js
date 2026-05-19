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
exports.getLiveMatches = getLiveMatches;
exports.getScheduledMatches = getScheduledMatches;
exports.getMatchById = getMatchById;
exports.getAiPrediction = getAiPrediction;
exports.updateMatchLive = updateMatchLive;
exports.createMatch = createMatch;
const matchService = __importStar(require("../services/match.service"));
const ai_service_1 = require("../services/ai.service");
const Match_1 = require("../models/Match");
async function getLiveMatches(_req, res) {
    const matches = await matchService.getLiveMatches();
    res.json({ success: true, data: matches });
}
async function getScheduledMatches(req, res) {
    const { date } = req.query;
    const matches = await matchService.getScheduledMatches(date);
    res.json({ success: true, data: matches });
}
async function getMatchById(req, res) {
    const match = await matchService.getMatchById(req.params.id);
    if (!match) {
        res.status(404).json({ success: false, message: 'Match not found' });
        return;
    }
    res.json({ success: true, data: match });
}
async function getAiPrediction(req, res) {
    try {
        const prediction = await (0, ai_service_1.generateMatchPrediction)(req.params.id);
        res.json({ success: true, data: prediction });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate prediction';
        res.status(400).json({ success: false, message });
    }
}
async function updateMatchLive(req, res) {
    const { homeScore, awayScore, minute, status, event } = req.body;
    try {
        if (homeScore !== undefined && awayScore !== undefined && minute !== undefined) {
            await matchService.updateMatchScore(req.params.id, homeScore, awayScore, minute);
        }
        if (status) {
            await matchService.updateMatchStatus(req.params.id, status);
        }
        if (event) {
            await matchService.addTimelineEvent(req.params.id, event);
        }
        res.json({ success: true, message: 'Match updated' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Update failed';
        res.status(400).json({ success: false, message });
    }
}
async function createMatch(req, res) {
    try {
        const match = await Match_1.Match.create(req.body);
        res.status(201).json({ success: true, data: match });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create match';
        res.status(400).json({ success: false, message });
    }
}
//# sourceMappingURL=match.controller.js.map