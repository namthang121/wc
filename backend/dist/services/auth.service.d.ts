import { IUser } from '../models/User';
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare function registerUser(username: string, email: string, password: string): Promise<{
    user: IUser;
    tokens: TokenPair;
}>;
export declare function loginUser(email: string, password: string): Promise<{
    user: IUser;
    tokens: TokenPair;
}>;
export declare function refreshTokens(refreshToken: string): Promise<TokenPair>;
export declare function registerFcmToken(userId: string, token: string): Promise<void>;
export {};
//# sourceMappingURL=auth.service.d.ts.map