import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    role: 'user' | 'admin';
    favoriteTeams: mongoose.Types.ObjectId[];
    fcmTokens: string[];
    predictionPoints: number;
    notificationPreferences: {
        matchStart: boolean;
        goals: boolean;
        redCards: boolean;
        finalResult: boolean;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map