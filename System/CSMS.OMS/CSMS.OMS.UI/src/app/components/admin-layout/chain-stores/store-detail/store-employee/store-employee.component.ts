import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../../../../services/router.service';

@Component({
  selector: 'app-store-employee',
  templateUrl: './store-employee.component.html'
})
export class StoreEmployeeComponent implements OnInit {

  public branchId: number;

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params) {
        this.branchId = +params['id'];
      } else {
        this.routerService.notFound();
      }
    });
  }
}
