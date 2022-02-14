import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { AppEffects } from './effects';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './reducers/router.reducer';
import { metaReducers } from './reducers/index'
    import { from } from 'rxjs';
@NgModule({
    imports: [
      StoreModule.forRoot(reducers, { metaReducers }),
      EffectsModule.forRoot(AppEffects),
      !environment.production ? StoreDevtoolsModule.instrument() : [],
      StoreRouterConnectingModule,
    ],
    providers: [
      {
        provide: RouterStateSerializer,
        useClass: CustomSerializer,
      },
    ],
  })
export class AppStoreModule {}
