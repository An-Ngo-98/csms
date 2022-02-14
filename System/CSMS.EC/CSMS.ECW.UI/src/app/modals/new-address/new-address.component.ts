import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState,
  CreateAddress, LoadAllProvince, LoadDistrictByIdProvince,
  LoadWardByIdDistrict, UpdateAddress, AddressActionTypes, CreateAddressSuccess, UpdateAddresSuccess } from 'app/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddressToUpdate, AddressToCreate, Address } from 'app/models/address.model';
import { userSelector } from 'app/store/reducers/user.reducer';
import { User } from 'app/models/user.model';
import { Province, District, Ward } from 'app/models/location.model';
import { get } from 'lodash';
import { provinceSelector,
  districtSelector,
  wardSelector,
  LocationLoading,
  locationLoadingSelector
} from 'app/store/reducers/location.reducer';
import { BaseComponent } from 'app/components/base.component';
import { Observable } from 'rxjs';
import { AddressLoading, addressLoadingSelector } from 'app/store/reducers/address.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { ValidateForm } from 'app/common/helpers/form-validator';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.component.html',
  styleUrls: ['./new-address.component.scss']
})
export class NewAddressComponent extends BaseComponent implements OnInit {
  public createAddressForm: FormGroup;
  public user: User;
  public provinces: Province[];
  public districts: District[];
  public wards: Ward[];
  public currentProvinceId: string;
  public currentDistrictId: string;
  public currentProvince: Province;
  public currentDistrict: District;
  public loading$: Observable<LocationLoading>;
  public loadingAddress$: Observable<AddressLoading>;
  public newAddressFormErrors: any;
  constructor(
    public dialogRef: MatDialogRef<NewAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address,
    private dispatcher: Actions,
    private store: Store<AppState>
  ) {
    super();
    this.dispatcher
      .pipe(
        ofType(
          AddressActionTypes.CreateAddressSuccessAction,
          AddressActionTypes.UpdateAddressSuccessAction
        ),
        filter(
          (action: CreateAddressSuccess | UpdateAddresSuccess) =>
            action instanceof CreateAddressSuccess ||
            action instanceof UpdateAddresSuccess
        ),
      )
      .subscribe(action => {
        this.close();
      });
    this._subscription.add(
      this.store.pipe(select(userSelector)).subscribe(user => {
        if (user) {
          this.user = user;
        }
      })
    );
    this.newAddressFormErrors = {
      receiver: {},
      phoneNumber: {},
      country: {},
      province: {},
      district: {},
      ward: {},
    };
  }

  ngOnInit() {
    this.createAddressForm = new FormGroup({
      receiver: new FormControl(this.data.receiver, [Validators.required]),
      phoneNumber: new FormControl(this.data.phoneNumber, [Validators.required]),
      country: new FormControl(this.data.country, [Validators.required]),
      province: new FormControl(this.data.province, [Validators.required]),
      district: new FormControl(this.data.district, [Validators.required]),
      ward: new FormControl(this.data.ward, [Validators.required]),
      detail: new FormControl(this.data.detail),
    });
    this.createAddressForm.valueChanges.subscribe(() => {
      ValidateForm(this.newAddressFormErrors, this.createAddressForm);
    });
    this.loading$ = this.store.pipe(select(locationLoadingSelector));
    this.loadingAddress$ = this.store.pipe(select(addressLoadingSelector));
    this._subscription.add(
      this.store.pipe(select(provinceSelector)).subscribe(province => {
        if (province) {
          this.provinces = province;
          province.filter(pro => pro.name === this.data.province).map(item => {
            this.currentProvince = item;
          })
          this.currentProvinceId = this.currentProvince && this.currentProvince.id;
          if (this.currentProvinceId) {
            this.store.dispatch(new LoadDistrictByIdProvince(this.currentProvinceId));
          }
        }
      })
    )
    this._subscription.add(
      this.store.pipe(select(districtSelector)).subscribe(district => {
        if (district) {
          this.districts = district;
          district.filter(dis => dis.name === this.data.district).map(item => {
            this.currentDistrict = item;
          })
          this.currentDistrictId = this.currentDistrict && this.currentDistrict.id;
          if (this.currentDistrictId) {
            this.store.dispatch(new LoadWardByIdDistrict(this.currentDistrictId))
          }
        }
      })
    )
    this._subscription.add(
      this.store.pipe(select(wardSelector)).subscribe(ward => {
        if (ward) {
          this.wards = ward;
        }
      })
    )
    this.store.dispatch(new LoadAllProvince());
  }

  public get isEditing(): boolean {
      return !!get(this, 'data.id');
  }

  public submit() {
    this.isEditing ? this.updateAddress() : this.createAddress();
  }

  public createAddress() {
    const createAddress: AddressToCreate = {
      userId: this.user.id,
      receiver: this.createAddressForm.controls['receiver'].value,
      phoneNumber: this.createAddressForm.controls['phoneNumber'].value,
      country: this.createAddressForm.controls['country'].value,
      province: this.createAddressForm.controls['province'].value,
      district: this.createAddressForm.controls['district'].value,
      ward: this.createAddressForm.controls['ward'].value,
      detail: this.createAddressForm.controls['detail'].value,
    };
    this.store.dispatch(new CreateAddress(createAddress));
  }

  public updateAddress() {
    const addressUpdate: AddressToUpdate = {
      id: this.data.id,
      userId: this.data.userId,
      receiver: this.createAddressForm.controls['receiver'].value,
      phoneNumber: this.createAddressForm.controls['phoneNumber'].value,
      country: this.createAddressForm.controls['country'].value,
      province: this.createAddressForm.controls['province'].value,
      district: this.createAddressForm.controls['district'].value,
      ward: this.createAddressForm.controls['ward'].value,
      detail: this.createAddressForm.controls['detail'].value,
    }
    this.store.dispatch(new UpdateAddress(addressUpdate))
  }

  public onSelectProvinces(event) {
    this._subscription.add(
      this.store.pipe(select(provinceSelector)).subscribe(province => {
        if (!province) { return; }
        province.filter(pro => pro.name === event.value).map(item => {
          if (!item) { return; }
          this.currentProvince = item;
        })
      })
    )
    this.currentProvinceId = this.currentProvince.id;
    this.store.dispatch(new LoadDistrictByIdProvince((this.currentProvinceId)));
  }

  public onSelectDistrict(event) {
    this._subscription.add(
      this.store.pipe(select(districtSelector)).subscribe(district => {
        if (!district) { return; }
        district.filter(dis => dis.name === event.value).map(item => {
          if (!item) { return; }
          this.currentDistrict = item;
        })
      })
    )
    this.currentDistrictId = this.currentDistrict.id;
    this.store.dispatch(new LoadWardByIdDistrict((this.currentDistrictId)));
  }

  public close() {
    this.dialogRef.close();
  }
}
