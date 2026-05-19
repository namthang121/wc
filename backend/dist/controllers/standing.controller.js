"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStandings = getAllStandings;
exports.getGroupStandings = getGroupStandings;
const Standing_1 = require("../models/Standing");
async function getAllStandings(_req, res) {
    const standings = await Standing_1.Standing.find()
        .populate('team', 'name shortName code flag logo group')
        .sort({ group: 1, points: -1, goalDifference: -1, goalsFor: -1 });
    // Group by group letter
    const grouped = {};
    for (const s of standings) {
        const team = s.team;
        const group = s.group ?? team.group;
        if (!grouped[group])
            grouped[group] = [];
        grouped[group].push(s);
    }
    res.json({ success: true, data: grouped });
}
async function getGroupStandings(req, res) {
    const { group } = req.params;
    const standings = await Standing_1.Standing.find({ group: group.toUpperCase() })
        .populate('team', 'name shortName code flag logo')
        .sort({ points: -1, goalDifference: -1, goalsFor: -1 });
    res.json({ success: true, data: standings });
}
//# sourceMappingURL=standing.controller.js.map