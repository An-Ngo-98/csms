export class CsmsMaterial {
    public id: number;
    public name: string;
    public unit: string;
    public amount: number;
}

export class MaterialViewModel {
    public id: number;
    public name: string;
    public unit: string;
    public amount: number;
    public partners: string[] = [];
}

export class ImportMaterialViewModel {
    public partnerId: number;
    public materialId: number;
    public quantityUnit: number;
    public price: number;
    public havePaid = false;
}

export class ExportMaterialViewModel {
    public branchId: number;
    public branchName: string;
    public materialId: number;
    public quantityUnit: number;

    constructor(branchId: number, branchName: string, materialId: number, quantityUnit = null) {
        this.branchId = branchId;
        this.branchName = branchName;
        this.materialId = materialId;
        this.quantityUnit = quantityUnit ? quantityUnit : 0;
    }
}

export class ImportExportHistoryViewModel {
    public materialId: number;
    public materialName: number;
    public unit: string;
    public partnerId: number;
    public partnerName: number;
    public branchId: number;
    public branchName: string;
    public time: Date;
    public quantity: number;
    public isImport: number;
}
