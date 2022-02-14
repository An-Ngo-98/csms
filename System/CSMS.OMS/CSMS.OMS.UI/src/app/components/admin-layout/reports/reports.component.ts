import { Component } from '@angular/core';
import { MenuTab } from '../../commons/menu-tabs/menu-tabs.component';

export const IdTabs = {
  RevenueOverview: 1,
  RevenueStore: 2,
  RevenueCategory: 3,
  BestSellingProducts: 4,
  PromotionsReport: 5,
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent {

  public selectedTab: number;
  public idTabs = IdTabs;
  public listTab: MenuTab[] = [
    new MenuTab(IdTabs.RevenueOverview, 'Revenue Overview', 'nc-chart-bar-32'),
    new MenuTab(IdTabs.RevenueStore, 'Revenue by Store', 'nc-chart-bar-32'),
    new MenuTab(IdTabs.RevenueCategory, 'Revenue by Category', 'nc-chart-bar-32'),
    new MenuTab(IdTabs.BestSellingProducts, 'Best Selling Products', 'nc-chart-bar-32'),
    new MenuTab(IdTabs.PromotionsReport, 'Promotions Report', 'nc-chart-bar-32'),
  ];

  constructor() { }
}
