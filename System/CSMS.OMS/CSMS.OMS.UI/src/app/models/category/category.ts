export class CsmsCategory {
    public id: number;
    public name: string;
    public enabled = true;
}

export class CategoryViewModel {
    public id: number;
    public name: string;
    public products: string[];
    public enabled = true;
    public isNewPhoto: string;
}
