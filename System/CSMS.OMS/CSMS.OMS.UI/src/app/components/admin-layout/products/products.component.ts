import { Component } from '@angular/core';
import { MenuTab } from '../../commons/menu-tabs/menu-tabs.component';

export const IdTabs = {
    Products: 1,
    Categories: 2
}

@Component({
    selector: 'app-products-cmp',
    templateUrl: 'products.component.html'
})

export class ProductsComponent {
    public selectedTab: number;
    public idTabs = IdTabs;
    public listTab: MenuTab[] = [
        new MenuTab(IdTabs.Products, 'Products', 'nc-basket'),
        new MenuTab(IdTabs.Categories, 'Categories', 'nc-book-bookmark')
    ];
}
