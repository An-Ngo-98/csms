import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState, GetVoucher, ChooseVoucher, VoucherActionTypes, ChooseVoucherSuccess } from 'app/store';
import { voucherSelector, chooseVoucherSelector, VoucherLoading, voucherLoadingSelector } from 'app/store/reducers/voucher.reducer';
import { Voucher } from 'app/models/voucher.model';
import { BaseComponent } from 'app/components/base.component';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { filter } from 'rxjs/operators';
import { get } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-choose-vouchers',
  templateUrl: './choose-vouchers.component.html',
  styleUrls: ['./choose-vouchers.component.scss']
})
export class ChooseVouchersComponent extends BaseComponent implements OnInit {
  public chooseVoucherForm: FormGroup;
  public voucherShipings: Voucher[];
  public voucherDiscounts: Voucher[];
  public chooseVoucherShip: Voucher;
  public chooseVoucherDiscount: Voucher;
  public chooseVoucherOrder = [];
  public vouchers: Voucher[];
  public loading$: Observable<VoucherLoading>;
  constructor(
    private store: Store<AppState>,
    private dispatcher: Actions,
    public dialogRef: MatDialogRef<ChooseVouchersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Voucher,
  ) {
    super();
    this.dispatcher
      .pipe(
        ofType(
          VoucherActionTypes.ChooseVoucherSuccessAction,
        ),
        filter(
          (action: ChooseVoucherSuccess) =>
            action instanceof ChooseVoucherSuccess
        ),
      )
      .subscribe(action => {
        this.close();
      });
    this._subscription.add(
      this.store.pipe(select(voucherSelector)).subscribe(vouchers => {
        this.vouchers = vouchers;
      })
    )
  }

  ngOnInit() {
    this.chooseVoucherForm = new FormGroup({
      voucher: new FormControl(this.data.id),
    });
    this.store.dispatch(new GetVoucher());
    this.loading$ = this.store.pipe(select(voucherLoadingSelector));
  }

  public chooseVoucher() {
    const voucherId = this.chooseVoucherForm.controls['voucher'].value;
    const choose = this.vouchers.find(vouchers => vouchers.id === voucherId);
    this.store.dispatch(new ChooseVoucher(choose));
  }

  public close() {
    this.dialogRef.close();
  }

}
