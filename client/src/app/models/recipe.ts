import { Tag } from "./tag";

export interface Recipe {
    name: string;
    description: string;
    pictureUrls: string[];
    recipeTags: Tag[];
}