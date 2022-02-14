import { Component } from '@angular/core';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',       title: 'Dashboard',         icon: 'nc-bank',                class: '' },
    { path: '/reports',         title: 'Reports',           icon: 'nc-single-copy-04',      class: '' },
    { path: '/orders',          title: 'Orders',            icon: 'nc-tag-content',         class: '' },
    { path: '/invoices',        title: 'Invoices',          icon: 'nc-paper',               class: '' },
    { path: '/products',        title: 'Products',          icon: 'nc-basket',              class: '' },
    { path: '/chain-stores',    title: 'Chain Stores',      icon: 'nc-shop',                class: '' },
    { path: '/warehouse',       title: 'Ware house',        icon: 'nc-box',                 class: '' },
    { path: '/promotions',      title: 'Promotions',        icon: 'nc-money-coins',         class: '' },
    { path: '/users',           title: 'Users',             icon: 'nc-single-02',           class: '' },
    { path: '/setting',         title: 'Setting',           icon: 'nc-settings-gear-65',    class: 'active-pro' },
];

@Component({
    moduleId: module.id,
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {
    public menuItems: any[] = ROUTES.filter(menuItem => menuItem);
}
