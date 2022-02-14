export interface Voucher {
    id: number;
    code: string;
    startTimeInDate: Date;
    endTimeInDate: Date;
    title: string;
    description: string;
    eventTypeCode: string;
    discountPercent: number;
    maxDiscount: number;
    minTotalInvoice: number;
    accountLimit: number;
    quantityLimit: number;
    appliedAllProducts: boolean;
    devices: string;
}
