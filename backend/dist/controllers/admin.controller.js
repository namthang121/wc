"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
exports.createTeam = createTeam;
exports.updateTeam = updateTeam;
exports.listUsers = listUsers;
exports.toggleUserStatus = toggleUserStatus;
exports.initializeStandings = initializeStandings;
const User_1 = require("../models/User");
const Match_1 = require("../models/Match");
const News_1 = require("../models/News");
const Team_1 = require("../models/Team");
const Standing_1 = require("../models/Standing");
async function getDashboardStats(_req, res) {
    const [users, liveMatches, totalMatches, newsCount] = await Promise.all([
        User_1.User.countDocuments({ isActive: true }),
        Match_1.Match.countDocuments({ status: { $in: ['live', 'halftime'] } }),
        Match_1.Match.countDocuments(),
        News_1.News.countDocuments({ isPublished: true }),
    ]);
    res.json({ success: true, data: { users, liveMatches, totalMatches, newsCount } });
}
async function createTeam(req, res) {
    try {
        const team = await Team_1.Team.create(req.body);
        res.status(201).json({ success: true, data: team });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create team';
        res.status(400).json({ success: false, message });
    }
}
async function updateTeam(req, res) {
    const team = await Team_1.Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!team) {
        res.status(404).json({ success: false, message: 'Team not found' });
        return;
    }
    res.json({ success: true, data: team });
}
async function listUsers(req, res) {
    const page = parseInt(req.query.page ?? '1', 10);
    const limit = Math.min(parseInt(req.query.limit ?? '20', 10), 100);
    const users = await User_1.User.find()
        .select('-password -fcmTokens')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.json({ success: true, data: users });
}
async function toggleUserStatus(req, res) {
    const user = await User_1.User.findById(req.params.id);
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: { isActive: user.isActive } });
}
async function initializeStandings(req, res) {
    const teams = await Team_1.Team.find().select('_id group');
    const ops = teams.map((t) => ({
        updateOne: {
            filter: { team: t._id },
            update: { $setOnInsert: { team: t._id, group: t.group, played: 0, points: 0, goalDifference: 0 } },
            upsert: true,
        },
    }));
    await Standing_1.Standing.bulkWrite(ops);
    res.json({ success: true, message: `Initialized standings for ${teams.length} teams` });
}
//# sourceMappingURL=admin.controller.js.map