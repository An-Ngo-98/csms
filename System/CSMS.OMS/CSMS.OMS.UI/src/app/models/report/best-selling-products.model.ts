export class BestSellingProductsViewModel {
    public percentageProductRevenues: PercentageProductRevenuesViewModel[] = [];
    public percentageProductQuantity: PercentageProductQuantityViewModel[] = [];
    public details: ProductListOrdersViewModel[] = [];
    public startDate: Date;
    public endDate: Date;
}

export class ProductListOrdersViewModel {
    public productId: number;
    public productName: string;
    public totalQuantity: number;
    public totalQuantityPercent: number;
    public totalRevenue: number;
    public totalRevenuePercent: number;
}

export class PercentageProductRevenuesViewModel {
    public productId: number;
    public productName: string;
    public totalRevenue: number;
    public percent: number;
}

export class PercentageProductQuantityViewModel {
    public productId: number;
    public productName: string;
    public totalQuantity: number;
    public percent: number;
}
