import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export abstract class BaseComponent implements OnDestroy {
  protected _subscription = new Subscription();
  public ngOnDestroy() {
    this._subscription.unsubscribe();
  }
//   // tslint:disable:no-any
//   public trackByIndex(index: number, item: any) {
//     return index;
//   }
//   public trackById(index: number, item: any) {
//     return item.id;
//   }
}
