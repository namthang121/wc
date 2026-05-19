import mongoose, { Document } from 'mongoose';
export interface INews extends Document {
    title: string;
    summary: string;
    content: string;
    imageUrl: string;
    sourceUrl: string;
    sourceName: string;
    tags: string[];
    relatedTeams: mongoose.Types.ObjectId[];
    viewCount: number;
    isPublished: boolean;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const News: mongoose.Model<INews, {}, {}, {}, mongoose.Document<unknown, {}, INews, {}, {}> & INews & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=News.d.ts.map