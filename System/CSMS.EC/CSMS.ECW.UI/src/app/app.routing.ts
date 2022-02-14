import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';

export const AppRoutes: Routes = [
    // {
    //     path: 'landing',
    //    loadChildren: './pages/landing/landing.module#LandingPageModule'
    // },
    {
        path: 'user',
        loadChildren: './components/user/user.module#UserModule'
    },
    // {
    //     path: 'user',
    //     loadChildren: () => import('./components/user/user.module').then(mod => mod.UserModule)
    // },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },

];

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
