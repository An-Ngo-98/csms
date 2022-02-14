export class RevenueOverviewViewModel {
    public totalProceeds: number;
    public numOfTransactions: number;
    public totalDiscount: number;
    public avgPerTransaction: number;
    public numbOfCoinsRefunded: number;
    public avgRevenuePerHour: ChartDataViewModel[] = [];
    public revenuePerDay: ChartDataViewModel[] = [];
    public startTime: Date;
    public endTime: Date;
}

export class ChartDataViewModel {
    public key: string;
    public value: number;
}
