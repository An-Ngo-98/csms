export class OrderCart {
    id: string;
    userId: string;
    fullname: string;
    receiver: string;
    phoneNumber: string;
    address: string;
    noteToChef: string;
    merchandiseSubtotal: number;
    shippingFee: number;
    shippingService: string;
    storeId: number;
    storeCode: string;
    storeName: string;
    distance: string;
    shippingNote: string;
    voucherId: string;
    voucherCode: string;
    discountPercent: string;
    usedCoins: string;
    discountShippingFee: string;
    discountVoucherApplied: string;
    isFreeShipVoucher: boolean;
    total: string;
    earnedCoins: string;
    orderDetails: any;
    orderedTime: Date;
    canceledTime: Date;
    completedTime: Date;
    shippedTime: Date;
    cookedTime: Date
}

export class OrderToOrder {
    userId: string;
    fullname: string;
    receiver: string;
    phoneNumber: string;
    address: string;
    // noteToChef: string;
    merchandiseSubtotal: number;
    shippingFee: number;
    shippingService: string;
    storeId: number;
    storeCode: string;
    storeName: string;
    distance: string;
    shippingNote: string;
    voucherId: number;
    voucherCode: string;
    discountPercent: number;
    usedCoins: string;
    discountShippingFee: string;
    discountVoucherApplied: number;
    isFreeShipVoucher: boolean;
    total: number;
    earnedCoins: string;
    orderDetails: any;
}

export class OrderDetail {
    productId: string;
    productName: string;
    categoryId: string;
    categoryName: string;
    quantity: string;
    price: string;
    originalPrice: string;
    photoId: string;
}
