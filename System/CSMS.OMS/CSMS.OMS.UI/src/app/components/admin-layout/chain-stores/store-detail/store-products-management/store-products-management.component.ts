import { ApiController } from '../../../../../commons/consts/api-controller.const';
import { AppService } from '../../../../../configs/app-service';
import { BranchService } from '../../../../../services/system/branch.service';
import { CategoryService } from '../../../../../services/product/category.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { DropDownData } from '../../../../commons/dropdown/dropdown.component';
import { EnableProductViewModel } from '../../../../../models/product/product-list';
import { map } from 'rxjs/operators';
import { Message } from '../../../../../commons/consts/message.const';
import { ProductService } from '../../../../../services/product/product.service';
import { zip } from 'rxjs';
import { NotificationService } from '../../../../../services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../../../../services/router.service';

@Component({
  selector: 'app-store-products-management',
  templateUrl: './store-products-management.component.html'
})
export class StoreProductsManagementComponent implements OnInit {

  public loading = false;
  public errorMessage: string;
  public categorySelected = 0;
  public branchSelected = 0;
  public branchNameSelected: string;

  public listCategory: DropDownData[] = [];
  public listBranch: DropDownData[] = [];
  public listStoreProduct: EnableProductViewModel[];
  public listAvailableProduct: EnableProductViewModel[];

  private listAllProduct: EnableProductViewModel[];
  private photoSize = 300;
  private photoUrl = AppService.getPath(ApiController.CdnApi.ProductPhoto + '{0}/{1}');

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private productService: ProductService,
    private branchService: BranchService,
    private categoryService: CategoryService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.initFilter();
  }

  private initFilter(): void {
    this.listCategory.push(new DropDownData(0, 'All categories', null, true));

    zip(
      this.categoryService.getEnabledCategory(),
      this.branchService.getEnabledBranch(),
      this.productService.getEnableProduct()
    ).pipe(
      map(([categories, branchs, products]) => {
        if (categories) {
          categories.forEach((item) => {
            this.listCategory.push(new DropDownData(item.id, item.name));
          });
        }
        if (branchs) {
          branchs.forEach((item) => {
            this.listBranch.push(new DropDownData(item.id.toString(), item.shortName, item.name));
          });
          this.route.params.subscribe(params => {
            if (params) {
              this.branchSelected = +params['id'];
              const branch = this.listBranch.find(item => item.key === this.branchSelected.toString());
              this.branchNameSelected = branch.value + ' - ' + branch.description;
            } else {
              this.routerService.notFound();
            }
          });
        }
        if (products) {
          this.listAllProduct = products;
        }
      })
    ).subscribe(
      (res) => this.getStoreProduct(),
      (err) => this.errorMessage = Message.Error.SEVER_ERROR);
  }

  private getStoreProduct(): void {
    this.loading = true;
    if (this.branchSelected !== null && this.branchSelected !== 0) {
      this.productService.getProductByBranchId(this.branchSelected).subscribe(
        (res) => {
          this.loading = false;
          this.listStoreProduct = res;
          const temp: number[] = this.listStoreProduct.map(n => n.id);
          this.listAvailableProduct = this.listAllProduct.filter(i => temp.indexOf(i.id) === -1);
        }, (err) => {
          this.loading = false;
          this.errorMessage = Message.Error.SEVER_ERROR;
        }
      )
    }
  }

  public onSave(): void {
    this.loading = true;
    this.productService.updateStoreProduct(this.branchSelected, this.listStoreProduct).subscribe(
      (res) => {
        this.loading = false;
        this.notificationService.success(Message.ProductManagement.SAVE_PRODUCT_SUCCESS);
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.ProductManagement.SAVE_PRODUCT_FAIL);
      }
    )
  }

  public getProductPhotoUrl(imageId: number, size = this.photoSize) {
    return this.photoUrl.replace('{0}', imageId.toString()).replace('{1}', size.toString());
  }

  public drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
