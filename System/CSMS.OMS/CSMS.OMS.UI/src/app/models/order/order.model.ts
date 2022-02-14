export class CsmsOrder {
    public id: string;
    public userId: number;
    public fullname: string;
    public receiver: string;
    public phoneNumber: string;
    public address: string;
    public noteToChef: string;
    public merchandiseSubtotal: number;
    public shippingFee: number;
    public shippingService: string;
    public storeId: number;
    public storeCode: string;
    public storeName: string;
    public distance: number;
    public shippingNote: string;
    public voucherId: number;
    public voucherCode: string;
    public discountPercent: number;
    public usedCoins: number;
    public discountShippingFee: number;
    public discountVoucherApplied: number;
    public isFreeShipVoucher: boolean;
    public total: number;
    public earnedCoins: number;
    public orderedTime: Date;
    public cookedTime: Date;
    public shippedTime: Date;
    public completedTime: Date;
    public canceledTime: Date;

    public orderDetails: CsmsOrderDetail[] = [];

    public selected = false;
}

export class CsmsOrderDetail {
    public orderId: string;
    public productId: number;
    public productName: string;
    public categoryId: number;
    public categoryName: string;
    public quantity: number;
    public price: number;
    public originalPrice: number;
    public photoId = 0;
}

export class TodayOrderViewModel {
    public totalPending: number;
    public totalShipping: number;
    public totalCooking: number;
    public totalCompleted: number;
    public totalCanceled: number;

    public orderStatusSelected: number;
    public storeIdsSelected: number[] = [];
    public timeNow: Date;

    public items: CsmsOrder[] = [];
}
