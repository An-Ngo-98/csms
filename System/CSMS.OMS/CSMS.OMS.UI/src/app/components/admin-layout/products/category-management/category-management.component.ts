import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryViewModel } from 'app/models/category';
import { PagedListModel } from '../../../../models/app/paged-list.model';
import { CategoryService } from '../../../../services/product/category.service';
import { PaginationComponent } from '../../../commons/pagination/pagination.component';
import { NotificationService } from '../../../../services/notification.service';
import { Message } from '../../../../commons/consts/message.const';
import { SpinnerColor, SpinnerType } from '../../../../commons/consts/spinner.const';
import { AppService } from '../../../../configs/app-service';
import { ApiController } from '../../../../commons/consts/api-controller.const';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html'
})
export class CategoryManagementComponent implements OnInit {

  public loading = false;
  public loadingList = false;
  public error = false;
  public errorMessage = '';
  public Message = Message;
  public SpinnerColor = SpinnerColor;
  public SpinnerType = SpinnerType;
  public page = 1;
  public pageSize = 5;
  public listPageSize = [5, 10, 20, 50];
  private photoUrl = AppService.getPath(ApiController.CdnApi.Categories + '{0}' + '?size=300');
  private newPhoto: File;
  public newPhotoUrl: String | ArrayBuffer;

  public catSelected: CategoryViewModel;
  public listCategory: PagedListModel<CategoryViewModel>;

  @ViewChild('inputProductName', { static: false }) inputElement: ElementRef;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.catSelected = new CategoryViewModel();
    this.getListCategory(1, this.pageSize);
  }

  public getListCategory(page = 1, pageSize = this.pageSize): void {
    this.page = page;
    this.pageSize = pageSize;
    this.loadingList = true;
    this.categoryService.getListCategory(page, pageSize).subscribe(
      (res) => {
        this.loadingList = false;
        this.listCategory = res;
      }, (err) => {
        this.loadingList = false;
        this.notificationService.error(Message.CategoryManagement.LOAD_CATEGORY_LIST_FAIL);
      }
    )
  }

  public onClickAddCategory(): void {
    this.error = false;
    this.catSelected = new CategoryViewModel();
    this.newPhoto = null;
    this.newPhotoUrl = null;
    this.inputElement.nativeElement.focus();
  }

  public onSave(): void {

    if (!this.catSelected.name) {
      this.error = true;
      this.errorMessage = 'The category name cannot null';
      return;
    }

    this.error = false;
    this.catSelected.products = [];
    const isNewCat = this.catSelected.id ? false : true;
    if (this.catSelected) {
      this.loading = true;

      if (!isNewCat && this.newPhoto) {
        this.savePhoto(this.catSelected.id);
      }

      this.categoryService.saveCategory(this.catSelected).subscribe(
        (res) => {
          if (res) {
            this.loading = false;
            this.catSelected = new CategoryViewModel();
            if (isNewCat) {
              if (this.newPhoto) {
                this.savePhoto(res.id);
              }
              this.listCategory.items.push(res);
            } else {
              const index = this.listCategory.items.findIndex(p => p.id === res.id);
              this.listCategory.items[index].name = res.name;
              this.listCategory.items[index].isNewPhoto = new Date().getTime().toString();
              this.listCategory.items[index].enabled = res.enabled;
            }
          }
        }, (err) => {
          this.loading = false;
          this.notificationService.error(Message.CategoryManagement.SAVE_CATEGORY_FAIL);
        });
    }
  }

  private savePhoto(categoryId) {
    this.categoryService.saveCategoryPhoto(categoryId, this.newPhoto).subscribe(
      (res) => {
        this.newPhoto = null;
        this.newPhotoUrl = null;
      }, (err) => {
        this.newPhoto = null;
        this.newPhotoUrl = null;
        this.notificationService.error(Message.CategoryManagement.SAVE_CATEGORY_IMAGE_FAIL);
      }
    );
  }

  public onEdit(cat: CategoryViewModel): void {
    this.catSelected = Object.assign({}, cat);
    this.newPhoto = null;
    this.newPhotoUrl = null;
    this.inputElement.nativeElement.focus();
  }

  public onDelete(catId: number): void {
    if (catId) {
      this.loading = true;
      this.categoryService.deleteCategory(catId).subscribe(
        (res) => {
          if (res) {
            this.loading = false;
            this.listCategory.items = this.listCategory.items.filter((item) => item.id !== catId);
          }
        }, (err) => {
          this.loading = false;
          this.notificationService.error(Message.CategoryManagement.DELETE_CATEGORY_FAIL);
        });
    }
  }

  public onCancel(): void {
    this.error = false;
    this.catSelected = new CategoryViewModel();
  }

  public getPhotoUrl(isNewAvatar: string = null) {
    let result = this.photoUrl.replace('{0}', this.catSelected.id ? this.catSelected.id.toString() : '0');
    result += isNewAvatar ? '&reload=' + isNewAvatar : '';

    return result;
  }

  public onUploadAvatar(files: FileList) {
    if (files.length === 0) {
      return;
    }

    const fileType = files[0].type;
    if (fileType.match(/image\/*/) === null) {
      this.errorMessage = 'Only images are supported';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.newPhoto = files.item(0);
      this.newPhotoUrl = reader.result;
    }
  }
}
