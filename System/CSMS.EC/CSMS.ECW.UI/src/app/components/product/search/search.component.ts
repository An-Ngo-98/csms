import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store, select } from '@ngrx/store';
import { AppState, SearchProduct, GetProductByBranchId, LoadProduct } from 'app/store';
import { productSelector } from 'app/store/reducers/product.reducer';
import { Product, ProductItem } from 'app/models/product.model';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { BaseComponent } from 'app/components/base.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends BaseComponent implements OnInit {
  length = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  public product: ProductItem;
  public imgSizeProduct = 200;
  public stringSearch: any;
  public page = 1;
  public pageSize = 10;
  public sortField = 1;
  public categorySelected = 0;
  public enabled = true;
  // MatPaginator Output
  pageEvent: PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) {
    super();
    this._subscription.add(
      this.route.paramMap.subscribe(params => {
        this.stringSearch = params.get('stringSearch')
      })
    );
  }

  ngOnInit() {
    this.store.dispatch(new LoadProduct(this.page, this.pageSize, this.sortField, this.stringSearch, this.enabled))
    this.store.dispatch(new GetProductByBranchId(this.stringSearch))
    this.store.dispatch(new SearchProduct(this.page, this.pageSize, this.sortField, this.categorySelected,
      this.enabled, this.stringSearch));
    this._subscription.add(
      this.store.pipe(select(productSelector)).subscribe(products => {
        this.product = products
      })
    );
  }

  public getImg(id) {
    return AppService.getPath(ApiController.CdnApi.ProductPhoto + id + '/' + this.imgSizeProduct)
  }

}
