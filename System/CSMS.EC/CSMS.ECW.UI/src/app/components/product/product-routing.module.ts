import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { SearchComponent } from './search/search.component';
const routes: Routes = [
  {
    path: 'product/detail/:id',
    component: DetailComponent
  },
  {
      path: 'product/search/:stringSearch',
      component: SearchComponent
  },
//   {
//     path: 'product/search',
//     component: SearchComponent
// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
