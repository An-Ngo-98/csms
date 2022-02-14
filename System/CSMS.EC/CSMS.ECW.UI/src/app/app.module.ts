import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutes, AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from './components/shared/shared.module';
import { ProfileComponent } from './components/user/profile/profile.component';
import { UserModule } from './components/user/user.module';
import { DetailComponent } from './components/product/detail/detail.component';
import { SearchComponent } from './components/product/search/search.component';
import { ProductModule } from './components/product/product.module';
import { PaymentComponent } from './components/checkout/payment/payment.component';
import { CartComponent } from './components/checkout/cart/cart.component';
import { CheckoutModule } from './components/checkout/checkout.module';
import { AppStoreModule } from './store/store.module';
import { HttpClientModule } from '@angular/common/http';
import { AppServices } from './services/index'
import { from } from 'rxjs';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './store/reducers/router.reducer';
// import { AuthenticationModule } from './components/authentication/authentication.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { ShowProductLittleComponent } from './common/show-product-little/show-product-little.component';
import { ShowProductMoreComponent } from './common/show-product-more/show-product-more.component';
import { ShowProductLittleTwoComponent } from './common/show-product-little-two/show-product-little-two.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';
const config: SocketIoConfig = { url: 'http://52.74.41.113:4444', options: {} };

export function socialConfigs() {
  const configSocial = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('318904792576416')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('374629883888-g41u612tskufmfbtvrc1tujq2sh6p0fq.apps.googleusercontent.com')
      }
    ]
  );
  return configSocial;
}
@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ShowProductLittleComponent,
        ShowProductMoreComponent,
        ShowProductLittleTwoComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        NgbModule.forRoot(),
        // RouterModule.forRoot(AppRoutes, { useHash: false }),
        AppRoutingModule,
        FormsModule,
        RouterModule,
        SharedModule,
        CheckoutModule,
        ReactiveFormsModule,
        // UserModule,
        ProductModule,
        // AuthenticationModule

        // Redux
        MatSnackBarModule,
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router', // name of reducer key
        }),
        AppStoreModule,
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.cubeGrid,
            fullScreenBackdrop: true,
        }),
        SocketIoModule.forRoot(config)
    ],
    providers: [
        ...AppServices,
        AuthService,
        {
            provide: RouterStateSerializer,
            useClass: CustomSerializer,
        },
        {
          provide: AuthServiceConfig,
          useFactory: socialConfigs,
      },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
