export interface ITag {
    name: string | undefined;
    category: string;
}

export class Tag implements ITag {
    name: string | undefined;
    category: string;
    active: boolean;

    constructor({ name, category }: ITag, active: boolean = false) {
        this.name = name;
        this.category = category;
        this.active = active;
      }
}