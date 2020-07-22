export interface FolderModel {
    id: number;
    name: string;
    parentId?: number;
    children?: FolderModel[];
}