import mongoose, { Document } from 'mongoose';
export interface IPrediction extends Document {
    user: mongoose.Types.ObjectId;
    match: mongoose.Types.ObjectId;
    predictedHomeScore: number;
    predictedAwayScore: number;
    pointsEarned: number;
    isSettled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Prediction: mongoose.Model<IPrediction, {}, {}, {}, mongoose.Document<unknown, {}, IPrediction, {}, {}> & IPrediction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Prediction.d.ts.map