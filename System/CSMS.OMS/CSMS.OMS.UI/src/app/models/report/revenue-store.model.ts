export class RevenueByStoreViewModel {
    public storeRevenues: StoreRevenueViewModel[] = [];
    public details: RevenueByStoreListOrdersViewModel[] = [];
    public startDate: Date;
    public endDate: Date;
}

export class RevenueByStoreListOrdersViewModel {
    public storeId: number;
    public storeName: string;
    public totalInvoices: number;
    public totalInvoicesPercent: number;
    public totalRevenue: number;
    public totalRevenuePercent: number;
}

export class StoreRevenueViewModel {
    public storeId: number;
    public storeName: string;
    public revenueByDay: number[] = [];
    public totalRevenue: number;
    public percent: number;
}
