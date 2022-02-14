export class CsmsBranch {
    public id: number;
    public shortName: string;
    public name: string;
    public description: string;
    public openTime: string;
    public closeTime: string;
    public location: string;
    public enabled = true;
    public add_Country: string;
    public add_Province: string;
    public add_District: string;
    public add_Ward: string;
    public add_Detail: string;
    public tables: string;
    public spaceFee: number;
    public internetFee: number;
    public phoneNumbers: CsmsBranchPhoneNumber[];

    public isNewPhoto: string;
}

export class CsmsBranchPhoneNumber {
    public id: number;
    public branchId: number;
    public phoneNumber: string
}

export class EnabledBranchViewModel {
    public id: number;
    public shortName: string;
    public name: string;
    public address: string;
    public description: string;
    public tables: string;
    public spaceFee: number;
    public internetFee: number;
    public phoneNumbers: string[]
}
