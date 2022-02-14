import { Component } from '@angular/core';
import { Icons } from '../../../commons/consts/icons.const';
import { MenuTab } from '../../commons/menu-tabs/menu-tabs.component';

export const IdTabs = {
  Employee: 1,
  Customer: 2,
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent {
  public selectedTab: number;
  public idTabs = IdTabs;
  public listTab: MenuTab[] = [
    new MenuTab(IdTabs.Employee, 'Employees', Icons.nc_user_run),
    new MenuTab(IdTabs.Customer, 'Customers', Icons.nc_single_02),
  ];
}
