import mongoose, { Document } from 'mongoose';
export interface IStanding extends Document {
    team: mongoose.Types.ObjectId;
    group: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    form: ('W' | 'D' | 'L')[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Standing: mongoose.Model<IStanding, {}, {}, {}, mongoose.Document<unknown, {}, IStanding, {}, {}> & IStanding & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Standing.d.ts.map