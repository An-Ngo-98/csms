import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LocationActionUnion, LocationActionTypes } from '../actions';
import { Province, District, Ward } from 'app/models/location.model';
import { load } from '@angular/core/src/render3';
export interface LocationLoading {
    loadingEntities?: boolean;
    createEntity?: boolean;
    updateEntity?: boolean;
    deleteEntity?: boolean;
}
export interface State {
    province: Province[];
    district: District[];
    ward: Ward[];
    locationByAddress: any;
    loading: LocationLoading;
}
export const initialState: State =  {
    province: [],
    district: [],
    ward: [],
    locationByAddress: undefined,
    loading: {}
}
export function reducer(state = initialState, action: LocationActionUnion): State {
    switch (action.type) {
        case LocationActionTypes.LoadAllProvincesAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case LocationActionTypes.LoadAllProvincesSuccessAction: {
            return {
                ...state,
                province: action.provinces,
                loading: {...state.loading, loadingEntities: false}
            };
        }
        case LocationActionTypes.LoadAllProvincesFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case LocationActionTypes.LoadDistrictByIdProvinceAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case LocationActionTypes.LoadDistrictByIdProvinceSuccessAction: {
            return {
                ...state,
                district: action.districs,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case LocationActionTypes.LoadDistrictByIdProvinceFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case LocationActionTypes.LoadWardByIdDistrictAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case LocationActionTypes.LoadWardByIdDistrictSuccessAction: {
            return {
                ...state,
                ward: action.wards,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case LocationActionTypes.LoadWardByIdDistrictFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case LocationActionTypes.GetLocationByAddressAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case LocationActionTypes.GetLocationByAddressSucessAction: {
            return {
                ...state,
                locationByAddress: action.address,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case LocationActionTypes.GetLocationByAddressFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        default:
            return state;
    }
}
export const getLocationFeatureState = createFeatureSelector<State>('locations');

export const locationByAddressSelector = createSelector(
    getLocationFeatureState,
    (state: State) => state.locationByAddress,
);

export const provinceSelector = createSelector(
    getLocationFeatureState,
    (state: State) => state.province,
);

export const districtSelector = createSelector(
    getLocationFeatureState,
    (state: State) => state.district,
);

export const wardSelector = createSelector(
    getLocationFeatureState,
    (state: State) => state.ward,
);
export const locationLoadingSelector = createSelector(
    getLocationFeatureState,
    (state: State) => state.loading,
);


