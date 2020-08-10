export interface GlobalSettingsModel {
    id: number;
    maxSize: number;
    limitPerHour: number;
    minLength: number;
    minDigits: number;
    bigLetters: number;
    specialCharacters: number;
    totalDiscSpace: number;
}