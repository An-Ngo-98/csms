import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from 'app/components/base.component';
import { Store, select } from '@ngrx/store';
import { AppState, GetInfoFromToken, GetOrderByUserId } from 'app/store';
import { userSelector } from 'app/store/reducers/user.reducer';
import { getorderByUserIdSelector, loadingOrderSelector, OrderLoading } from 'app/store/reducers/order.reducer';
import { OrderCart } from 'app/models/order.model';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ProductLoading } from 'app/store/reducers/product.reducer';
@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent extends BaseComponent implements OnInit {
  public orderOfUser: OrderCart[];
  public imgSize = 70;
  dataSource: MatTableDataSource<OrderCart>;
  public loading$: Observable<OrderLoading>;
  displayedColumns: string[] = ['orderID', 'name', 'image', 'orderTime', 'total', 'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private store: Store<AppState>
  ) {
    super();
    this._subscription.add(
      this.store.pipe(select(userSelector)).subscribe(user => {
        if (user) {
          this.store.dispatch(new GetOrderByUserId(user.id));
        }
      })
    );
    this._subscription.add(
      this.store.pipe(select(getorderByUserIdSelector)).subscribe(orders => {
        this.orderOfUser = orders;
        this.dataSource = new MatTableDataSource<OrderCart>(orders);
        this.dataSource.paginator = this.paginator;
      })
    )
  }

  ngOnInit() {
    this.store.dispatch(new GetInfoFromToken(localStorage.getItem('token')));
    this.loading$ = this.store.pipe(select(loadingOrderSelector));
  }

  public getImg(id) {
    return AppService.getPath(ApiController.CdnApi.ProductPhoto + id + '/' + this.imgSize)
  }
}
