"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeams = getAllTeams;
exports.getTeamById = getTeamById;
exports.searchTeams = searchTeams;
const Team_1 = require("../models/Team");
async function getAllTeams(_req, res) {
    const teams = await Team_1.Team.find().select('-players').sort({ group: 1, name: 1 }).lean();
    res.json({ success: true, data: teams });
}
async function getTeamById(req, res) {
    const team = await Team_1.Team.findById(req.params.id).lean();
    if (!team) {
        res.status(404).json({ success: false, message: 'Team not found' });
        return;
    }
    res.json({ success: true, data: team });
}
async function searchTeams(req, res) {
    const { q } = req.query;
    if (!q) {
        res.status(400).json({ success: false, message: 'Query parameter q is required' });
        return;
    }
    const teams = await Team_1.Team.find({ $text: { $search: q } }).select('-players').limit(10).lean();
    res.json({ success: true, data: teams });
}
//# sourceMappingURL=team.controller.js.map