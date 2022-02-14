import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../../../../services/router.service';

@Component({
  selector: 'app-promotion-invoices',
  templateUrl: './promotion-invoices.component.html'
})
export class PromotionInvoicesComponent implements OnInit {

  private promotionId: number;

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params) {
        this.promotionId = params['id'];
        this.initData();
      } else {
        this.routerService.notFound();
      }
    });
  }

  private initData(): void {

  }

}
