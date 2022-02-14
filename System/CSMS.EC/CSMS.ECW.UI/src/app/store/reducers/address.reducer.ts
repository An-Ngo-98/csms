import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AddressActionUnion, AddressActionTypes } from '../actions';
import { Address } from 'app/models/address.model';

export interface AddressLoading {
    loadingEntities?: boolean;
    createEntity?: boolean;
    updateEntity?: boolean;
    deleteEntity?: boolean;
}
export interface State {
    addresses: Address[];
    loading: AddressLoading;
}
export const initialState: State =  {
    addresses: [],
    loading: {},
}
export function reducer(state = initialState, action: AddressActionUnion): State {
    switch (action.type) {
        case AddressActionTypes.GetAddressAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case AddressActionTypes.GetAddressSuccessAction: {
            return {
                ...state,
                addresses: action.address,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case AddressActionTypes.GetAddressFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case AddressActionTypes.CreateAddressAction: {
            return {
                ...state,
                loading: {...state.loading, createEntity: true}
            }
        }
        case AddressActionTypes.CreateAddressSuccessAction: {
            return {
                ...state,
                addresses: [...state.addresses, action.address],
                loading: {...state.loading, createEntity: false}
            }
        }
        case AddressActionTypes.CreateAddressFailureAction: {
            return {
                ...state,
                loading: {...state.loading, createEntity: false}
            }
        }
        case AddressActionTypes.UpdateAddressAction: {
            return {
                ...state,
                loading: {...state.loading, updateEntity: true}
            }
        }
        case AddressActionTypes.UpdateAddressSuccessAction: {
            return {
                ...state,
                addresses: state.addresses.map(address => {
                    if (address.id !== action.address.id) { return address; }
                    return {
                        ...address,
                        ...action.address,
                        loading: {...state.loading, updateEntity: false}
                    }
                })
            }
        }
        case AddressActionTypes.UpdateAddressFailureAction: {
            return {
                ...state,
                loading: {...state.loading, updateEntity: false}
            }
        }
        case AddressActionTypes.DeleteAddressAction: {
            return {
                ...state,
                loading: {...state.loading, deleteEntity: true}
            }
        }
        case AddressActionTypes.DeleteAddressSuccessAction: {
            return {
                ...state,
                addresses: state.addresses.filter(address => address.id !== action.addressId),
                loading: {...state.loading, deleteEntity: false}
            }
        }
        case AddressActionTypes.DeleteAddressFailureAction: {
            return {
                ...state,
                loading: {...state.loading, deleteEntity: false}
            }
        }
        default:
            return state;
    }
}
export const getAddressFeatureState = createFeatureSelector<State>('addresses');

export const addressSelector = createSelector(
    getAddressFeatureState,
    (state: State) => state.addresses,
);
export const addressLoadingSelector = createSelector(
    getAddressFeatureState,
    (state: State) => state.loading
);
