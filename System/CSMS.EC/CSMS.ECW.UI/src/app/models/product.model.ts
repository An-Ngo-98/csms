export interface ProductItem {
    items: Product[],
    pageIndex: number,
    pageSize: number,
    totalCount: number,
}

export interface Product {
    id: number;
    categoryId: string;
    categoryName: string;
    code?: string;
    name: string;
    price: number;
    shortDescription?: string;
    description: string;
    rate?: string;
    enabled: boolean;
    count: number;
    avatarId: number;
    img: any;
}
export interface ProductReview {
    items: ProductItemReview[],
    pageIndex: number,
    pageSize: number,
    totalCount: number,
}
export interface ProductItemReview {
    id: number;
    userId: number;
    fullname: string;
    score: number;
    title: string;
    comment: string;
    votedDate: Date;
    purchased: boolean;
}

export interface ReviewProductToSave {
    productId: number;
    userId: number;
    fullName: string;
    score: number;
    title: string;
    comment: string;
    invoiceId: string;
}
