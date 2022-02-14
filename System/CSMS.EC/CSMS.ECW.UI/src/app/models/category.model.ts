export interface CategoryItem {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    items: Category[];
}

export interface Category {
    id: string;
    name: string;
    enabled: boolean;
    deleted: boolean;
}
