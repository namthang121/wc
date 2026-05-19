"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsFeed = getNewsFeed;
exports.getNewsById = getNewsById;
exports.createNews = createNews;
exports.updateNews = updateNews;
exports.deleteNews = deleteNews;
const News_1 = require("../models/News");
async function getNewsFeed(req, res) {
    const page = parseInt(req.query.page ?? '1', 10);
    const limit = Math.min(parseInt(req.query.limit ?? '20', 10), 50);
    const { tag } = req.query;
    const filter = { isPublished: true };
    if (tag)
        filter.tags = tag;
    const [news, total] = await Promise.all([
        News_1.News.find(filter)
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('relatedTeams', 'name code flag')
            .select('-content')
            .lean(),
        News_1.News.countDocuments(filter),
    ]);
    res.json({
        success: true,
        data: news,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
}
async function getNewsById(req, res) {
    const news = await News_1.News.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true }).populate('relatedTeams', 'name code flag');
    if (!news || !news.isPublished) {
        res.status(404).json({ success: false, message: 'Article not found' });
        return;
    }
    res.json({ success: true, data: news });
}
async function createNews(req, res) {
    try {
        const news = await News_1.News.create(req.body);
        res.status(201).json({ success: true, data: news });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create news';
        res.status(400).json({ success: false, message });
    }
}
async function updateNews(req, res) {
    const news = await News_1.News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!news) {
        res.status(404).json({ success: false, message: 'Article not found' });
        return;
    }
    res.json({ success: true, data: news });
}
async function deleteNews(req, res) {
    await News_1.News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article deleted' });
}
//# sourceMappingURL=news.controller.js.map