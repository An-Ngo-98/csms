import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { Routes } from '@angular/router';
import { HomeGuard } from './guards/home.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    canActivate: [HomeGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./components/admin-layout/dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path: 'chain-stores',
        loadChildren: () => import('./components/admin-layout/chain-stores/chain-stores.module').then(mod => mod.ChainStoresModule)
      },
      {
        path: 'warehouse',
        loadChildren: () => import('./components/admin-layout/warehouse/warehouse.module').then(mod => mod.WarehouseModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./components/admin-layout/orders/orders.module').then(mod => mod.OrdersModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./components/admin-layout/reports/reports.module').then(mod => mod.ReportsModule)
      },
      {
        path: 'user-info/:id',
        loadChildren: () => import('./components/admin-layout/user-info/user-info.module').then(mod => mod.UserInfoModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./components/admin-layout/user-management/user-management.module').then(mod => mod.UserManagementModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./components/admin-layout/products/products.module').then(mod => mod.ProductsModule)
      },
      {
        path: 'promotions',
        loadChildren: () => import('./components/admin-layout/promotion-management/promotion-management.module')
          .then(mod => mod.PromotionManagementModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('./components/admin-layout/setting/setting.module').then(mod => mod.SettingModule)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./components/admin-layout/invoices/invoices.module').then(mod => mod.InvoicesModule)
      },
    ],
  },
  {
    path: '',
    loadChildren: () => import('./components/authentication/authentication.module').then(mod => mod.AuthenticationModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
]
