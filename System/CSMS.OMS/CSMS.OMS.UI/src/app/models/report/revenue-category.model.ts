export class RevenueByCategoryViewModel {
    public categoryRevenues: CategoryRevenueViewModel[] = [];
    public details: RevenueByCategoryListOrdersViewModel[] = [];
    public startDate: Date;
    public endDate: Date;
}

export class RevenueByCategoryListOrdersViewModel {
    public categoryId: number;
    public categoryName: string;
    public totalQuantity: number;
    public totalQuantityPercent: number;
    public totalRevenue: number;
    public totalRevenuePercent: number;
}

export class CategoryRevenueViewModel {
    public categoryId: number;
    public categoryName: string;
    public totalRevenue: number;
    public percent: number;
}
