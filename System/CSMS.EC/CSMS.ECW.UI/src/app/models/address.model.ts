export interface Address {
    id: string;
    userId: string;
    receiver: string;
    phoneNumber: string;
    country: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
    isDefault: boolean;
}

export interface AddressToUpdate {
    id: string;
    userId: string;
    receiver: string;
    phoneNumber: string;
    country: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
}

export interface AddressToCreate {
    userId: string;
    receiver: string;
    phoneNumber: string;
    country: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
}


