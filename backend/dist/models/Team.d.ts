import mongoose, { Document } from 'mongoose';
export interface ITeam extends Document {
    _id: mongoose.Types.ObjectId;
    externalId: string;
    name: string;
    shortName: string;
    code: string;
    flag: string;
    logo: string;
    group: string;
    confederation: string;
    players: {
        name: string;
        position: string;
        number: number;
        goals: number;
        assists: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Team: mongoose.Model<ITeam, {}, {}, {}, mongoose.Document<unknown, {}, ITeam, {}, {}> & ITeam & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Team.d.ts.map