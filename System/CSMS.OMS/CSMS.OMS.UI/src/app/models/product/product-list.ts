export class ProductViewModel {
    public id: number;
    public categoryId: number = null;
    public categoryName: string;
    public code: string;
    public name: string;
    public avatarId: number;
    public price: string;
    public shortDescription: string;
    public description: string;
    public rate: number;
    public searchString: string;
    public totalVote: number;
    public enabled = true;
    public photos: PhotoViewModel[];
    public selected = false;
    public isNewAvatar: string;

    constructor() {
        this.id = 0;
        this.avatarId = 0;
    }
}

export class PhotoViewModel {
    public id: number;
    public photoId: number;

    constructor(id: number, photoId: number) {
        this.id = id;
        this.photoId = photoId;
    }
}

export class EnableProductViewModel {
    public id: number;
    public code: string;
    public name: string;
    public categoryId: number;
    public categoryName: string;
    public avatarId: number;
    public price: number;
    public enabled = true;

    public display: string;
}
