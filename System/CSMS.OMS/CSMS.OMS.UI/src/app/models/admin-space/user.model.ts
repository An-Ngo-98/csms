export class UserLogin {
    public id: number;
    public userName: string;
    public accessToken: string;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public userCode: string;
    public isLoggedOut: boolean;
    public shortName(): string {
        return this.firstName + ' ' + this.lastName;
    }
    public fullName(): string {
        return this.firstName + ' ' + this.middleName + ' ' + this.lastName;
    }
}

export class Token {
    public accessToken: string;
    public expiredTime: Date;
}

export class UserViewModel {
    public id = 0;
    public userCode: number;
    public userName: string;
    public password: string;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public email: string;
    public phoneNumber: string;
    public citizenId: string;
    public gender: string;
    public birthday: Date = null;
    public statusId: number;
    public salary: number;
    public branchId: number;
    public roleId: number;
    public status: string;
    public addresses: AddressViewModel[];
}

export class AddressViewModel {
    public id: number;
    public receiver: string;
    public phoneNumber: string;
    public country: string;
    public province: string;
    public district: string;
    public ward: string;
    public detail: string;
    public isDefault = false;

    constructor() {
        this.country = 'Việt Nam';
    }
}

export class CsmsUserRole {
    public id: number;
    public roleId: number;
    public userId: number;
}

export class CsmsUserAddress {
    public id: number;
    public userId: number;
    public receiver: string;
    public phoneNumber: string;
    public country: string;
    public province: string;
    public district: string;
    public ward: string;
    public detail: string;
    public isDefault = false;

    constructor(userId: number, addressViewModel: AddressViewModel) {
        this.id = addressViewModel.id;
        this.userId = userId;
        this.receiver = addressViewModel.receiver;
        this.phoneNumber = addressViewModel.phoneNumber;
        this.country = addressViewModel.country;
        this.province = addressViewModel.province;
        this.district = addressViewModel.district;
        this.ward = addressViewModel.ward;
        this.detail = addressViewModel.detail;
        this.isDefault = addressViewModel.isDefault;
    }
}
