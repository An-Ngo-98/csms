import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, LoadProduct } from 'app/store';
import { productSelector, ProductLoading, productLoadingSelector } from 'app/store/reducers/product.reducer';
import { Product, ProductItem } from 'app/models/product.model';
import { catogerySelector } from 'app/store/reducers/category.reducer';
import { Category, CategoryItem } from 'app/models/category.model';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { BaseComponent } from '../base.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {
  // public products: Product[];
  public product: ProductItem;
  public categories: CategoryItem;
  public page = 1;
  public pageSize = 10;
  public sortField = 1;
  public categorySelected = 0;
  public enabled = true;
  public productImgUrl = '';
  public imgSize = 200;
  public productOfCategory: Product[];
  public productOfCategory2: Product[];
  public productOfCategory3: Product[];
  public loadingProduct$: Observable<ProductLoading>

  constructor(private store: Store<AppState>) {
    super();
    this._subscription.add(
      this.store.pipe(select(productSelector)).subscribe(product => {
        this.product = product;
        this.productOfCategory = product && product.items;
        this.productOfCategory2 = product && product.items;
        this.productOfCategory3 = product && product.items;
      })
    );
    this._subscription.add(
      this.store.pipe(select(catogerySelector)).subscribe(categories => {
        this.categories = categories;
      })
    );
  }
  ngOnInit() {
    this.store.dispatch(new LoadProduct(this.page, this.pageSize, this.sortField, this.categorySelected, this.enabled));
    this.loadingProduct$ = this.store.pipe(select(productLoadingSelector));
  }
  public getImg(id) {
    return AppService.getPath(ApiController.CdnApi.ProductPhoto + id + '/' + this.imgSize)
  }

  public getProductFromCategory(id) {
    if (id === 0) {
      this.productOfCategory = this.product.items
    } else {
      this.productOfCategory = this.product.items.filter(products => products.categoryId === id);
    }
  }

  public getProductFromCategory2(id) {
    if (id === 0) {
      this.productOfCategory2 = this.product.items
    } else {
      this.productOfCategory2 = this.product.items.filter(products => products.categoryId === id);
    }
  }

  public getProductFromCategory3(id) {
    if (id === 0) {
      this.productOfCategory3 = this.product.items
    } else {
      this.productOfCategory3 = this.product.items.filter(products => products.categoryId === id);
    }
  }
}
