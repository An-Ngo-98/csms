import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { LoadAllProvince, LocationActionTypes, LoadAllProvinceSuccess, LoadAllProvinceFailure, LoadDistrictByIdProvince,
    LoadDistrictByIdProvinceSuccess, LoadDistrictByIdProvinceFailure, LoadWardByIdDistrict, LoadWardByIdDistrictSuccess,
    LoadWardByIdDistrictFailure,
    GetLocationByAddress,
    GetLocationByAddressSuccess,
    GetLocationByAddressFailure} from '../actions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { LocationService } from 'app/services/system/location.service';
import { Province, District, Ward } from 'app/models/location.model';

@Injectable()
export class LocationEffects {
    @Effect() public loadAllProvinces$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAllProvince>(LocationActionTypes.LoadAllProvincesAction),
        switchMap(action =>
            this.locationService.loadAllProvinces().pipe(
                mergeMap((provinces: Province[]) => {
                    return [new LoadAllProvinceSuccess(provinces)];
                }),
                catchError(err => of(new LoadAllProvinceFailure())),
            ),
        ),
    );

    @Effect() public loadDistrictByIdProvince$: Observable<Action> = this.actions$.pipe(
        ofType<LoadDistrictByIdProvince>(LocationActionTypes.LoadDistrictByIdProvinceAction),
        switchMap(action =>
            this.locationService.loadDistrictByIdProvince(action.provinceId).pipe(
                mergeMap((districts: District[]) => [new LoadDistrictByIdProvinceSuccess(districts)]),
                catchError(err => of(new LoadDistrictByIdProvinceFailure())),
            ),
        ),
    );

    @Effect() public loadWardByIdDistrict$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWardByIdDistrict>(LocationActionTypes.LoadWardByIdDistrictAction),
        switchMap(action =>
            this.locationService.loadWardByIdDistrict(action.districtId).pipe(
                mergeMap((wards: Ward[]) => [new LoadWardByIdDistrictSuccess(wards)]),
                catchError(err => of(new LoadWardByIdDistrictFailure())),
            ),
        ),
    );

    @Effect() public getLocationByAddress$: Observable<Action> = this.actions$.pipe(
        ofType<GetLocationByAddress>(LocationActionTypes.GetLocationByAddressAction),
        switchMap(action =>
            this.locationService.getLocationByAddress(action.address).pipe(
                mergeMap((address: any) => [new GetLocationByAddressSuccess(address)]),
                catchError(err => of(new GetLocationByAddressFailure())),
            ),
        ),
    );

    constructor(private actions$: Actions, private locationService: LocationService, private store: Store<AppState>) { }
}
