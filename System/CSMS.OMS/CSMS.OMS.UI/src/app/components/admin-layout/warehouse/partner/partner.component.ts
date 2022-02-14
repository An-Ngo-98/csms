import { Component, OnInit } from '@angular/core';
import { Message } from '../../../../commons/consts/message.const';
import { PagedListModel } from '../../../../models/app/paged-list.model';
import { PartnerViewModel, PartnerMaterialViewModel } from '../../../../models/warehouse/partner.model';
import { PartnerService } from '../../../../services/warehouse/partner.service';
import { RouterService } from '../../../../services/router.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html'
})
export class PartnerComponent implements OnInit {
  public page = 1;
  public pageSize = 10;
  public loading = false;
  public listPartner: PagedListModel<PartnerViewModel>;
  public searchString = '';

  constructor(
    private partnerService: PartnerService,
    private routeService: RouterService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.getListPartner(1, this.pageSize);
  }

  public getListPartner(page = 1, pageSize = this.pageSize): void {
    this.loading = true;
    this.page = page;
    this.pageSize = pageSize;

    this.partnerService.getListPartner(
      this.page,
      this.pageSize,
      this.searchString
    ).subscribe(
      (res) => {
        this.listPartner = res;
        this.loading = false;
      },
      (err) => {
        this.notificationService.error(Message.PartnerManagement.LOAD_PARTNER_LIST_FAIL);
        this.loading = false;
      });
  }

  public onView(id: number = null): void {
    this.routeService.partnerInfo(id ? id.toString() : 'new');
  }

  public getListMaterial(materials: PartnerMaterialViewModel[] = []): string {
    return materials.map(item => item.name).join(', ');
  }
}
