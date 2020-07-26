export interface HistoryModel {
    id: number;
    actionDate: Date;
    description: string;
    param?: string;
    userData: string;
}