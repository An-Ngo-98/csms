import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { SpinnerColor, SpinnerType } from '../../../../../commons/consts/spinner.const';
import { ProductViewModel, PhotoViewModel } from '../../../../../models/product/product-list';
import { DropDownData } from '../../../../commons/dropdown/dropdown.component';
import { AppService } from 'app/configs/app-service';
import { ApiController } from '../../../../../commons/consts/api-controller.const';
import { Message } from '../../../../../commons/consts/message.const';
import { ProductService } from '../../../../../services/product/product.service';
import { ResultUploadPhotoViewModel } from '../../../../../models/product/product-photo';
import { NotificationService } from '../../../../../services/notification.service';

@Component({
  selector: 'app-product-popup',
  templateUrl: './product-popup.component.html'
})
export class ProductPopupComponent extends DialogComponent<any, any> implements OnInit {

  private photoSizeList = 100;
  private photoUrl = AppService.getPath(ApiController.CdnApi.ProductPhoto + '{0}/' + '{1}');

  // Product avatar
  private newAvatar: File;                    // Save to cdn-api
  public newAvatarUrl: String | ArrayBuffer; // Show to UI

  // Photo images list
  private deletedPhotoIds: number[] = [];   // Save to cdn-api
  private newPhotos: File[] = [];           // Save to cdn-api
  public newPhotoUrls = [];                 // Show to UI

  // Variables
  public loading = false;
  public error = false;
  public errorMessage = '';
  public SpinnerType = SpinnerType;
  public SpinnerColor = SpinnerColor;
  public Message = Message;
  public listCategory: DropDownData[] = [];
  public listSearchString: string[] = [];

  public product: ProductViewModel;

  constructor(
    public dialogService: DialogService,
    private productService: ProductService,
    private notificationService: NotificationService) {
    super(dialogService);
  }

  ngOnInit(): void {
    this.listCategory = this.listCategory.filter(item => item.key !== 'All' && item.key !== 0);
    this.listSearchString = this.product.searchString ? this.product.searchString.split(' | ') : [];
  }

  public onSave(): void {
    this.loading = true;
    if (!this.isDataValid()) {
      this.loading = false;
      return;
    }

    this.saveNewAvatar();
  }

  private saveNewAvatar(): void {
    if (this.newAvatar) {
      this.productService.saveProductPhoto(this.product.avatarId, this.newAvatar).subscribe(
        (res: ResultUploadPhotoViewModel) => {
          this.product.avatarId = res.imageId;
          this.saveNewPhoto();
        }
      );
    } else {
      this.saveNewPhoto();
    }
  }

  private saveNewPhoto(): void {
    if (this.deletedPhotoIds && this.deletedPhotoIds.length > 0) {
      this.deletedPhotoIds.forEach(id => {
        this.productService.deleteProductPhoto(id).subscribe();
      });
    }

    if (this.newPhotos && this.newPhotos.length > 0) {
      this.newPhotos.forEach((photo, index) => {
        this.productService.saveProductPhoto(0, photo).subscribe(
          (res: ResultUploadPhotoViewModel) => {
            this.product.photos.push(new PhotoViewModel(0, res.imageId));
            if (index === this.newPhotos.length - 1) {
              this.saveProduct();
            }
          }
        );
      });
    } else {
      this.saveProduct();
    }
  }

  private saveProduct(): void {
    this.product.searchString = this.listSearchString.join(' | ');
    this.productService.saveProduct(this.product).subscribe(
      (res) => {
        if (res) {
          if (this.newAvatar) {
            res.isNewAvatar = new Date().getTime().toString();
          }
          this.result = res;
          this.close();
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.SaveFail);
      }
    )
  }

  public onCancel(): void {
    this.result = undefined;
    this.close();
  }

  public onDeleteOldPhoto(photo: PhotoViewModel) {
    if (photo) {
      this.deletedPhotoIds.push(photo.photoId);
      this.product.photos = this.product.photos.filter(item => item.id !== photo.id);
    }
  }

  public onDeleteNewPhoto(index: number) {
    if (index >= 0 && index < this.newPhotos.length) {
      this.newPhotos.splice(index, 1);
      this.newPhotoUrls.splice(index, 1);
    }
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
      this.newAvatar = files.item(0);
      this.newAvatarUrl = reader.result;
    }
  }

  public onUploadPhotos(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.match(/image\/*/) === null) {
        this.errorMessage = 'Any images are not supported';
      } else {

        let isSame = false;
        for (let k = 0; k < this.newPhotos.length; k++) {
          if (this.newPhotos[k].name === files[i].name) {
            isSame = true;
            break;
          }
        }

        if (!isSame) {
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = (event: any) => {
            this.newPhotos.push(files[i]);
            this.newPhotoUrls.push(reader.result);
          }
        }
      }
    }
  }

  private isDataValid(): boolean {
    if (!this.product.name) {
      this.error = true;
      this.errorMessage = 'Product name cannot null';

      return false;
    }

    this.error = false;
    return true;
  }

  public getProductPhotoUrl(imageId: number, isNewAvatar: string = null, size = this.photoSizeList) {
    let result = this.photoUrl.replace('{0}', imageId.toString()).replace('{1}', size.toString());
    result += isNewAvatar ? '?reload=' + isNewAvatar : '';

    return result;
  }
}
