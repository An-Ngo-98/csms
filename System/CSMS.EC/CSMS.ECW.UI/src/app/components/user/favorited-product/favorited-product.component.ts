import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store';
import { loveSelector } from 'app/store/reducers/product.reducer';
import { Product } from 'app/models/product.model';
import { BaseComponent } from 'app/components/base.component';

@Component({
  selector: 'app-favorited-product',
  templateUrl: './favorited-product.component.html',
  styleUrls: ['./favorited-product.component.scss']
})
export class FavoritedProductComponent extends BaseComponent implements OnInit {
  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['name', 'price', 'description', 'categoryName', 'rate'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private store: Store<AppState>
  ) {
    super();
    this._subscription.add(
      this.store.pipe(select(loveSelector)).subscribe(loveProduct => {
        this.dataSource = new MatTableDataSource<Product>(loveProduct);
      })
    )
   }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}
