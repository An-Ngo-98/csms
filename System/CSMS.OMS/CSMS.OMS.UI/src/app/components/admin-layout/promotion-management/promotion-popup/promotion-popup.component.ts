import { CategoryService } from '../../../../services/product/category.service';
import { Component, OnInit } from '@angular/core';
import { CsmsDevice, CsmsEvent } from '../../../../models/promotion';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { EnabledCategoryViewModel } from '../../../../models/category/enable-category';
import { EnableProductViewModel } from '../../../../models/product/product-list';
import { EventService } from '../../../../services/promotion/event.service';
import { map } from 'rxjs/operators';
import { Message } from '../../../../commons/consts/message.const';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { NotificationService } from '../../../../services/notification.service';
import { ProductService } from '../../../../services/product/product.service';
import { SpinnerColor, SpinnerType } from '../../../../commons/consts/spinner.const';
import { zip } from 'rxjs';

@Component({
  selector: 'app-promotion-popup',
  templateUrl: './promotion-popup.component.html'
})
export class PromotionPopupComponent extends DialogComponent<any, any> implements OnInit {

  // Variables
  public loading = false;
  public error = false;
  public errorMessage = '';
  public SpinnerType = SpinnerType;
  public SpinnerColor = SpinnerColor;
  public Message = Message;

  public listCodeType: DropDownData[] = [];
  public listDevice: CsmsDevice[] = [];
  public listCategories: EnabledCategoryViewModel[] = [];
  public listProducts: EnableProductViewModel[] = [];
  public currentDate = MomentHelper.currentDate().format(DateFormat.DateFormatJson);

  public promotion: CsmsEvent;
  public listCategorySelected: EnabledCategoryViewModel[] = [];
  public listProductSelected: EnableProductViewModel[] = [];

  constructor(
    public dialogService: DialogService,
    private eventService: EventService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService) {
    super(dialogService);

    zip(
      this.eventService.getCodeTypes(),
      this.eventService.getDevices(),
      this.productService.getEnableProduct(),
      this.categoryService.getEnabledCategory()
    ).pipe(
      map(([codeTypes, devices, products, categories]) => {
        if (codeTypes) {
          const temp: DropDownData[] = [];
          codeTypes.forEach((item) => {
            temp.push(new DropDownData(item.id.toString(), item.title));
          });
          this.listCodeType = temp;
          this.promotion.eventTypeId = codeTypes[0].id;
        }
        if (devices) {
          this.listDevice = devices;
          if (!this.promotion.id) {
            this.listDevice.forEach(device => {
              this.promotion.deviceIds.push(device.id);
            });
          }
        }
        if (categories) {
          this.listCategories = categories;
          this.promotion.categoryIds.forEach(catId => {
            const cat = categories.find(item => item.id === catId);
            cat.display = cat.name;
            this.listCategorySelected.push(cat);
          });
        }
        if (products) {
          this.listProducts = products;
          this.promotion.productIds.forEach(prodId => {
            const prod = products.find(item => item.id === prodId);
            prod.display = prod.name;
            this.listProductSelected.push(prod);
          });
        }
      })
    ).subscribe();
  }

  ngOnInit() {
    if (this.promotion && this.promotion.id > 0) {
      const temp = this.promotion;
      this.promotion = new CsmsEvent();
      this.promotion.id = temp.id;
      this.promotion.code = temp.code;
      this.promotion.startTime = new Date(temp.startTime);
      this.promotion.endTime = temp.endTime ? new Date(temp.endTime) : temp.endTime;
      this.promotion.startTimeInDate = temp.startTimeInDate;
      this.promotion.endTimeInDate = temp.endTimeInDate;
      this.promotion.title = temp.title;
      this.promotion.description = temp.description;
      this.promotion.eventTypeId = temp.eventTypeId;
      this.promotion.discountPercent = temp.discountPercent;
      this.promotion.maxDiscount = temp.maxDiscount;
      this.promotion.minTotalInvoice = temp.minTotalInvoice;
      this.promotion.accountLimit = temp.accountLimit;
      this.promotion.quantityLimit = temp.quantityLimit;
      this.promotion.appliedAllProducts = temp.appliedAllProducts;
      this.promotion.enabled = temp.enabled;
      this.promotion.productIds = temp.productIds;
      this.promotion.categoryIds = temp.categoryIds;
      this.promotion.deviceIds = temp.deviceIds;
    }
  }

  public onSave(): void {
    this.loading = true;
    this.error = false;
    this.promotion.categoryIds = this.promotion.appliedAllProducts ? [] : this.listCategorySelected.map(item => item.id);
    this.promotion.productIds = this.promotion.appliedAllProducts ? [] : this.listProductSelected.map(item => item.id);

    if (!this.isValidData()) {
      this.loading = false;
      return;
    }

    this.eventService.saveEvent(Object.assign({}, this.promotion)).subscribe(
      (res) => {
        if (res) {
          this.result = res;
          this.close();
          this.notificationService.success(Message.EventManagement.SAVE_EVENT_SUCCESS);
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.EventManagement.SAVE_EVENT_FAIL);
      });
  }

  public onCancel(): void {
    this.result = undefined;
    this.close();
  }

  public isExistDevice(deviceId: number): boolean {
    return this.promotion.deviceIds.find(e => e === deviceId) !== undefined;
  }

  public onCheckDevice(deviceId: number, event: boolean): void {
    if (event) {
      this.promotion.deviceIds.push(deviceId);
    } else {
      this.promotion.deviceIds = this.promotion.deviceIds.filter(e => e !== deviceId);
    }
  }

  public onUseAllProducts(flag: boolean): void {
    this.promotion.appliedAllProducts = flag;

    if (flag) {
      this.listProductSelected = [];
      this.listCategorySelected = [];
    }
  }

  public onUseCode(flag: boolean): void {
    this.promotion.code = '';
    if (flag) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < 12; i++) {
        this.promotion.code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    }
  }

  public onSetEventType(id: string): void {
    this.promotion.eventTypeId = +id;
    if (this.promotion.eventTypeId === 1) {
      this.promotion.discountPercent = null;
    } else {
      this.promotion.discountPercent = 0;
    }
  }

  private isValidData(): boolean {
    if (!this.promotion.startTime) {
      this.error = true;
      this.errorMessage = 'Start date and start time cannot empty.';
      return false;
    }

    if (this.promotion.endTime && this.promotion.startTime > this.promotion.endTime) {
      this.error = true;
      this.errorMessage = 'Start time must be less than end time.';
      return false;
    }

    if (this.promotion.eventTypeId !== 1 &&
      (!this.promotion.discountPercent || this.promotion.discountPercent <= 0 || this.promotion.discountPercent > 100)) {
      this.error = true;
      this.errorMessage = 'Discount percent must more than 0 to less or equal 100.';
      return false;
    }

    if (!this.promotion.title || this.promotion.title.trim().length === 0) {
      this.error = true;
      this.errorMessage = 'Title cannot be empty.';
      return false;
    }

    if (!this.promotion.description || this.promotion.description.trim().length === 0) {
      this.error = true;
      this.errorMessage = 'Description cannot be empty.';
      return false;
    }

    if (!this.promotion.deviceIds || this.promotion.deviceIds.length === 0) {
      this.error = true;
      this.errorMessage = 'The event must apply for at least 1 device.';
      return false;
    }

    return true;
  }

  public convertStringToTime(date: Date | string, outputWhenInvalid: string = null): string {
    if (date) {
      const temp = new Date(date);
      return temp.getHours() + ':' + temp.getMinutes();
    }

    return outputWhenInvalid;
  }
}
