import { Component, OnInit, Input } from '@angular/core';
import { Product, ProductItem } from 'app/models/product.model';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';

@Component({
  selector: 'app-show-product-little',
  templateUrl: './show-product-little.component.html',
  styleUrls: ['./show-product-little.component.scss']
})
export class ShowProductLittleComponent implements OnInit {
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
