export class Document {
    id: string;
    doc: string;
    type: string;
    storeID: number;
}

export class StatusOrder {
    id: string;
    doc: string;
    type: string;
    storeID: number;
    orderId: string;
    orderUserId: string;
}
