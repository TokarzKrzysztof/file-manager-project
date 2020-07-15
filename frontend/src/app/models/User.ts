export interface UserModel {
    id: number;
    email: string;
    name: string;
    surname: string;
    password: string;
    passwordRepeat?: string;
}