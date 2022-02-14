import { Component } from '@angular/core';
import { MenuTab } from '../../commons/menu-tabs/menu-tabs.component';

export const IdTabs = {
    Payments: 1,
    Deliveries: 2,
    Reports: 3,
    Interface: 4,
    DefaultFiles: 5
}

@Component({
    selector: 'app-setting',
    moduleId: module.id,
    templateUrl: 'setting.component.html'
})

export class SettingComponent {
    public selectedTab: number;
    public idTabs = IdTabs;
    public listTab: MenuTab[] = [
        new MenuTab(IdTabs.Payments, 'Payments', 'nc-credit-card'),
        new MenuTab(IdTabs.Deliveries, 'Deliveries', 'nc-delivery-fast'),
        new MenuTab(IdTabs.Reports, 'Reports', 'nc-single-copy-04'),
        new MenuTab(IdTabs.Interface, 'Interface', 'nc-settings'),
        new MenuTab(IdTabs.DefaultFiles, 'Default Files', 'nc-layout-11'),
    ];
}
