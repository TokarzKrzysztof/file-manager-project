export interface UserModel {
    email: string;
    id: number;
    isLoggedIn: boolean;
    name: string;
    password: string;
    passwordRepeat?: string;
    surname: string;
    token: string;
}