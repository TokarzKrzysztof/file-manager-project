export interface FileModel {
    id: number;
    fileName: string;
    uploadTime: Date;
    size: number;
    createdBy: string;
    deletedBy?: string;
    order?: number;
    title?: string;
}