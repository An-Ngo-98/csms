import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Product } from 'app/models/product.model';
import { Store, select } from '@ngrx/store';
import { AppState, DeleteProductBuyLater } from 'app/store';
import { buyLaterSelector } from 'app/store/reducers/product.reducer';
import { BaseComponent } from 'app/components/base.component';

@Component({
  selector: 'app-buy-later-product',
  templateUrl: './buy-later-product.component.html',
  styleUrls: ['./buy-later-product.component.scss']
})
export class BuyLaterProductComponent extends BaseComponent implements OnInit {

  dataSource: MatTableDataSource<Product>;

  displayedColumns: string[] = ['name', 'price', 'description', 'categoryName', 'rate', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private store: Store<AppState>
  ) {
    super();
    this._subscription.add(
      this.store.pipe(select(buyLaterSelector)).subscribe(buyLaterProduct => {
        this.dataSource = new MatTableDataSource<Product>(buyLaterProduct);
      })
    )
   }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  public deleteBuyLaterProduct(element) {
    this.store.dispatch(new DeleteProductBuyLater(element.id))
  }

}
