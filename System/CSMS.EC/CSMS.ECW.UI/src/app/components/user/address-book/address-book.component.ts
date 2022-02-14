import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState, GetInfoFromToken, GetAddress, DeleteAddress, LoadAllProvince } from 'app/store';
import { User } from 'app/models/user.model';
import { userSelector } from 'app/store/reducers/user.reducer';
import { addressSelector, AddressLoading, addressLoadingSelector } from 'app/store/reducers/address.reducer';
import { Address } from 'app/models/address.model';
import { NewAddressComponent } from 'app/modals/new-address/new-address.component';
import { BaseComponent } from 'app/components/base.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['receiver', 'phonenumber', 'country', 'province', 'district', 'ward', 'actions'];
  public user: User;
  public addresses: Address[];
  public address: Address;
  dataSource: MatTableDataSource<Address>;
  public loading$: Observable<AddressLoading>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new GetInfoFromToken(localStorage.getItem('token')));
    this._subscription.add(
      this.store.pipe(select(userSelector)).subscribe(user => {
        if (user) {
          this.store.dispatch(new GetAddress(user.id));
        }
      })
    );
    this._subscription.add(
      this.store.pipe(select(addressSelector)).subscribe(addresses => {
        this.addresses = addresses;
        this.dataSource = new MatTableDataSource<Address>(this.addresses);
        this.dataSource.paginator = this.paginator;
      })
    );
    this.loading$ = this.store.pipe(select(addressLoadingSelector));
  }

  public deleteAddress(address) {
    this.store.dispatch(new DeleteAddress(address.id))
  }

  // public openModalUpdate(address) {
  //   this.dialog.open(UpdateAddressComponent, {
  //     width: '40%',
  //     data: address
  //   });
  // }

  public openModalCreate(address?) {
    this.dialog.open(NewAddressComponent, {
      width: '40%',
      data: address
    });
  }

}

