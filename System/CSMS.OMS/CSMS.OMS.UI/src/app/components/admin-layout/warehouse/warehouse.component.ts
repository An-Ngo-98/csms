import { Component } from '@angular/core';
import { MenuTab } from '../../commons/menu-tabs/menu-tabs.component';
import { Icons } from '../../../commons/consts/icons.const';

export const IdTabs = {
  Warehouse: 1,
  StockIn: 2,
  StockOut: 3,
  SpendingBills: 4,
  Partners: 5,
  Materials: 6,
}

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html'
})
export class WarehouseComponent {
  public selectedTab: number;
  public idTabs = IdTabs;
  public listTab: MenuTab[] = [
    new MenuTab(IdTabs.Warehouse, 'Warehouse', Icons.nc_box),
    // new MenuTab(IdTabs.StockIn, 'Stock In', Icons.nc_cloud_upload_94),
    // new MenuTab(IdTabs.StockOut, 'Stock out', Icons.nc_cloud_download_93),
    new MenuTab(IdTabs.SpendingBills, 'Spending Bills', Icons.nc_paper),
    new MenuTab(IdTabs.Partners, 'Partners', Icons.nc_vector),
    new MenuTab(IdTabs.Materials, 'Materials', Icons.nc_layout_11),
  ];
}
