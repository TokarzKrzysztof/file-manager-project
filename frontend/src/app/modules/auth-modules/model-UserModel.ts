export interface UserModel {
    id: number;
    email: string;
    name: string;
    surname: string;
    password: string;
    passwordRepeat?: string;
    isLoggedIn: boolean;
    token: string;
    systemAccess: boolean;
    systemEditingEnabled: boolean;
    role: 'ADMIN' | 'USER';
}