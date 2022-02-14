import { ApiController } from '../../../../commons/consts/api-controller.const';
import { AppService } from '../../../../configs/app-service';
import { CategoryService } from 'app/services/product/category.service';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { ExportProductPopupComponent } from './export-product-popup/export-product-popup.component';
import { map } from 'rxjs/operators';
import { Message } from '../../../../commons/consts/message.const';
import { NotificationService } from '../../../../services/notification.service';
import { PagedListModel } from '../../../../models/app/paged-list.model';
import { ProductPopupComponent } from './product-popup/product-popup.component';
import { ProductService } from '../../../../services/product/product.service';
import { ProductViewModel } from 'app/models/product';
import { zip } from 'rxjs';

enum SortField {
  ProductName = 1,
  ProductStatus = 2,
  HighestRate = 3,
  LowestRate = 4,
  HighestPrice = 5,
  LowestPrice = 6,
  HighestVotes = 7,
  LowestVotes = 8
}

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnInit {

  public loading = false;
  public Message = Message;
  public photoSize = 300;
  public photoUrl = AppService.getPath(ApiController.CdnApi.ProductPhoto + '{0}/{1}');
  public page = 1;
  public pageSize = 8;
  public listPageSize = [4, 8, 16, 40, 80];
  public listCategory: DropDownData[] = [];
  public listStatus: DropDownData[] = [];
  public listSortField: DropDownData[] = [];

  public searchString = '';
  public categorySelected = 0;
  public statusSelected = 'All';
  public sortFieldSelected: number = SortField.ProductName;
  public listProduct: PagedListModel<ProductViewModel>;

  constructor(
    private dialogService: DialogService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.initFilter();
    this.getListProduct(1, this.pageSize);
  }

  public getListProduct(page = 1, pageSize = this.pageSize): void {
    this.loading = true;
    this.page = page;
    this.pageSize = pageSize;
    this.productService.getListProduct(
      this.page,
      this.pageSize,
      this.sortFieldSelected,
      this.categorySelected,
      this.statusSelected,
      this.searchString
    ).subscribe(
      (res) => {
        this.listProduct = res;
        this.loading = false;
      },
      (err) => {
        this.notificationService.error(Message.ProductManagement.LOAD_PRODUCT_LIST_FAIL);
        this.loading = false;
      });
  }

  public onClickAddEditProduct(product: ProductViewModel, index: number = null): void {

    let isNew = false;
    if (!product) {
      isNew = true;
      product = new ProductViewModel();
    }

    this.dialogService.addDialog(ProductPopupComponent, {
      product: product ? Object.assign({}, product) : new ProductViewModel(),
      listCategory: this.listCategory
    }).subscribe(
      (res) => {
        if (res && res.id !== 0) {
          if (index !== null) {
            this.listProduct.items[index] = res;
          } else {
            this.listProduct.items.push(res);
          }
          this.notificationService.success(Message.ProductManagement.SAVE_PRODUCT_SUCCESS);
        }
      }
    );
  }

  public onExport(): void {
    const searchCondition: any[] = [];
    searchCondition.push(this.sortFieldSelected);
    searchCondition.push(this.statusSelected);
    searchCondition.push(this.categorySelected);
    searchCondition.push(this.searchString);
    this.dialogService.addDialog(ExportProductPopupComponent, {
      selectedProductIds: this.listProduct,
      searchCondition
    }).subscribe();
  }

  public onClickDeleteProduct(id: number): void {
    this.loading = true;
    this.productService.deleteProduct(id).subscribe((res) => {
      if (res) {
        this.loading = false;
        this.listProduct.items = this.listProduct.items.filter((item) => item.id !== id);
        this.notificationService.success(Message.ProductManagement.DELETE_PRODUCT_SUCCESS);
      }
    }, (err) => {
      this.loading = false;
      this.notificationService.error(Message.ProductManagement.DELETE_PRODUCT_FAIL);
    });
  }

  public onChangeStatus(prod: ProductViewModel, status: boolean): void {
    prod.enabled = status;
    this.productService.saveProduct(prod).subscribe(
      (res) => { },
      (err) => {
        prod.enabled = !prod.enabled;
        this.notificationService.error(Message.ProductManagement.CHANGE_PRODUCT_STATUS_FAIL);
      });
  }

  public convertCurrency(price: number): string {
    if (!price) {
      return 'N/A';
    }

    return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public getProductPhotoUrl(imageId: number = 0, isNewAvatar: string = null, size = this.photoSize) {
    let result = this.photoUrl.replace('{0}', imageId.toString()).replace('{1}', size.toString());
    result += isNewAvatar ? '?reload=' + isNewAvatar : '';

    return result;
  }

  private initFilter(): void {

    // Status List
    this.listStatus.push(
      new DropDownData('All', 'All status', null, true),
      new DropDownData(true, 'Enabled'),
      new DropDownData(false, 'Disabled'));

    // Sort List
    this.listSortField.push(
      new DropDownData(SortField.ProductName, 'Product name'),
      new DropDownData(SortField.ProductStatus, 'Product status'),
      new DropDownData(SortField.LowestPrice, 'Price: lowest first', null, null, 'fa fa-arrow-up', 'text-success'),
      new DropDownData(SortField.HighestPrice, 'Price: highest first', null, null, 'fa fa-arrow-down', 'text-danger'),
      new DropDownData(SortField.LowestRate, 'Rate score: lowest first', null, null, 'fa fa-arrow-up', 'text-success'),
      new DropDownData(SortField.HighestRate, 'Rate score: highest first', null, null, 'fa fa-arrow-down', 'text-danger'),
      new DropDownData(SortField.LowestVotes, 'Total rates: lowest first', null, null, 'fa fa-arrow-up', 'text-success'),
      new DropDownData(SortField.HighestVotes, 'Total rates: highest first', null, null, 'fa fa-arrow-down', 'text-danger'));

    // Category List
    this.listCategory.push(
      new DropDownData(0, 'All categories', null, true),
      new DropDownData(null, 'None', null, true));

    zip(this.categoryService.getEnabledCategory()).pipe(
      map(([categories]) => {
        if (categories) {
          categories.forEach((item) => {
            this.listCategory.push(new DropDownData(item.id, item.name));
          });
        }
      })
    ).subscribe();
  }
}
