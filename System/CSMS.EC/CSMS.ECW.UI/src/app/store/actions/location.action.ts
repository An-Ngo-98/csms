import { Action } from '@ngrx/store';
import { ErrorAction } from 'app/models/error-action.class';
import { Province, District, Ward } from 'app/models/location.model';

export enum LocationActionTypes {
    LoadAllProvincesAction = '[Location] Load All Provinces',
    LoadAllProvincesSuccessAction = '[Location] Load All Provinces Success',
    LoadAllProvincesFailureAction = '[Location] Load All Provinces Failure',

    LoadDistrictByIdProvinceAction = '[Location] Load District By Id Province',
    LoadDistrictByIdProvinceSuccessAction = '[Location] Load District By Id Province Success',
    LoadDistrictByIdProvinceFailureAction = '[Location] Load District By Id Province Failure',

    LoadWardByIdDistrictAction = '[Location] Load Ward By Id District',
    LoadWardByIdDistrictSuccessAction = '[Location] Load Ward By Id District Success',
    LoadWardByIdDistrictFailureAction = '[Location] Load Ward By Id District Failure',

    GetLocationByAddressAction = '[Location] Get Location By Address',
    GetLocationByAddressSucessAction = '[Location] Get Location By Address Success',
    GetLocationByAddressFailureAction = '[Location] Get Location By Address Failure'
}

export class LoadAllProvince implements Action {
    public readonly type = LocationActionTypes.LoadAllProvincesAction;
    constructor() {}
}

export class LoadAllProvinceSuccess implements Action {
    public readonly type = LocationActionTypes.LoadAllProvincesSuccessAction;
    constructor(public provinces: Province[]) {}
}

export class LoadAllProvinceFailure implements Action {
    public readonly type = LocationActionTypes.LoadAllProvincesFailureAction;
    constructor() {}
}

export class LoadDistrictByIdProvince implements Action {
    public readonly type = LocationActionTypes.LoadDistrictByIdProvinceAction;
    constructor(public provinceId: string) {}
}

export class LoadDistrictByIdProvinceSuccess implements Action {
    public readonly type = LocationActionTypes.LoadDistrictByIdProvinceSuccessAction;
    constructor(public districs: District[]) {}
}

export class LoadDistrictByIdProvinceFailure implements Action {
    public readonly type = LocationActionTypes.LoadDistrictByIdProvinceFailureAction;
    constructor() {}
}

export class LoadWardByIdDistrict implements Action {
    public readonly type = LocationActionTypes.LoadWardByIdDistrictAction;
    constructor(public districtId: string) {}
}

export class LoadWardByIdDistrictSuccess implements Action {
    public readonly type = LocationActionTypes.LoadWardByIdDistrictSuccessAction;
    constructor(public wards: Ward[]) {}
}

export class LoadWardByIdDistrictFailure implements Action {
    public readonly type = LocationActionTypes.LoadWardByIdDistrictFailureAction;
    constructor() {}
}

export class GetLocationByAddress implements Action {
    public readonly type = LocationActionTypes.GetLocationByAddressAction;
    constructor(public address: string) {}
}

export class GetLocationByAddressSuccess implements Action {
    public readonly type = LocationActionTypes.GetLocationByAddressSucessAction;
    constructor(public address: any) {}
}

export class GetLocationByAddressFailure implements ErrorAction {
    public readonly type = LocationActionTypes.GetLocationByAddressFailureAction;
    constructor() {}
}
export type LocationActionUnion =
    | LoadAllProvince
    | LoadAllProvinceSuccess
    | LoadAllProvinceFailure
    | LoadDistrictByIdProvince
    | LoadDistrictByIdProvinceSuccess
    | LoadDistrictByIdProvinceFailure
    | LoadWardByIdDistrict
    | LoadWardByIdDistrictSuccess
    | LoadWardByIdDistrictFailure
    | GetLocationByAddress
    | GetLocationByAddressSuccess
    | GetLocationByAddressFailure;
