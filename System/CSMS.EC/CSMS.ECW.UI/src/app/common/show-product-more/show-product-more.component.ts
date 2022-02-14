import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'app/models/product.model';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';

@Component({
  selector: 'app-show-product-more',
  templateUrl: './show-product-more.component.html',
  styleUrls: ['./show-product-more.component.scss']
})
export class ShowProductMoreComponent implements OnInit {

  @Input() public products: Product[];
  public imgSize = 200;
  constructor() {
  }

  ngOnInit() {
  }

  public getImg(id) {
    return AppService.getPath(ApiController.CdnApi.ProductPhoto + id + '/' + this.imgSize)
  }

}
