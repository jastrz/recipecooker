import { ITag } from "./tag";

export interface Recipe {
    id?: number;
    name: string;
    description: string;
    pictureUrls: string[];
    recipeTags: ITag[];
}