import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { BootstrapModalModule } from 'angularx-bootstrap-modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonComponentModule } from './components/commons/common-component.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { LsHelper } from './commons/helpers/ls.helper';
import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { reducers } from './ngrx-store/reducers';
import { RouterModule } from '@angular/router';
import { SharedModule } from './components/shared/shared.module';
import { SocketIoModule } from 'ngx-socket-io';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-toggle-switch';

export function tokenGetter() {
  return LsHelper.getAccessToken();
}

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BootstrapModalModule,
    UiSwitchModule,
    SharedModule,
    HttpClientModule,
    CommonComponentModule,
    RouterModule.forRoot(AppRoutes, { useHash: false }),
    ToastrModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [
          'localhost:3001',
          'localhost:4001',
          'localhost:50001'
        ]
      }
    }),
    StoreModule.forRoot(reducers),
    NgxPermissionsModule.forRoot(),
    SocketIoModule.forRoot({
      url: 'http://52.74.41.113:4444',
      options: {}
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
