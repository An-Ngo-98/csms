import { DropDownData } from '../../components/commons/dropdown/dropdown.component';
export class WarehouseMaterialViewModel {
    public materialId: number;
    public materialName: string;
    public unit: string;
    public quantityExists: number;
    public partners: WarehousePartnerViewModel[];
    public defaultPartnerId: number;
    public defaultQuantity = 0;
    public dropDownData: DropDownData[];
}

export class WarehousePartnerViewModel {
    public partnerId: number;
    public partnerName: string;
    public materialPrice: number;
}

export class StoreMaterialViewModel {
    public branchId: number;
    public materialId: number;
    public materialName: string;
    public amount: number;
    public unit: string;
}
