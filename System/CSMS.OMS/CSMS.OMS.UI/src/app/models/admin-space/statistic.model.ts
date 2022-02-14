export class StatisticViewModel {
    public numOfNewCustomers: number;
    public numOfNewOrders: number;
    public numOfNewInvoices: number;
    public currentOrder: CurrentOrderViewModel;
    public revenueOverview: RevenueViewModel;
    public featuredCategories: FeaturedCategoryViewModel[];
    public bestSellingProducts: BestSellingProductViewModel[];
    public latestOrders: LatestOrderViewModel[];
    public startTime: Date;
    public endTime: Date;
    public currentTime: Date;
}

export class CurrentOrderViewModel {
    public total: number;
    public pending: number;
    public cooking: number;
    public shipping: number;
}

export class RevenueViewModel {
    public total: number;
    public totalOrders: number;
    public completedOrders: number;
    public canceledOrders: number;
}

export class FeaturedCategoryViewModel {
    public percent: number;
    public revenue: number;
    public categoryName: string;
}

export class BestSellingProductViewModel {
    public quantity: number;
    public revenue: number;
    public productName: string;
}

export class LatestOrderViewModel {
    public orderId: string;
    public store: string;
    public orderTime: Date;
    public total: number;
    public status: string;
}
