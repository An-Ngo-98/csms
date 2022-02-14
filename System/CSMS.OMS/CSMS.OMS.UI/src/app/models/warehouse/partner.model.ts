export class PartnerViewModel {
    public id: number;
    public name: string;
    public phoneNumber: string;
    public address: string;
    public materials: PartnerMaterialViewModel[] = [];
}

export class PartnerMaterialViewModel {
    public id: number;
    public materialId: number;
    public name: string;
    public unit: string;
    public amount: number;
    public price: number;
    public maxUnit: number;
}
