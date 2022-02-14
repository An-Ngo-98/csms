export interface BranchItem {
    items: Branch[],
    pageIndex: number,
    pageSize: number,
    totalCount: number,
}

export interface Branch {
    id: number;
    shortName: string;
    name: string;
    description: string;
    enabled: boolean;
    add_country: string;
    add_province: string;
    add_district: string;
    add_ward: string;
    deleted: boolean;
    latitude: number;
    longitude: number;
}
