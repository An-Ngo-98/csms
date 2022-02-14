import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LsHelper } from '../commons/helpers/ls.helper';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router) { }

  // ERROR
  public permissionDenied(): void {
    this.router.navigate(['/error/permission-denied']);
  }
  public serverError(): void {
    this.router.navigate(['/error/server-error']);
  }
  public serverMaintainance(): void {
    this.router.navigate(['/error/maintainance']);
  }
  public notFound(): void {
    this.router.navigate(['/error/not-found']);
  }

  // GENERAL
  public navigate(url: string): void {
    this.router.navigateByUrl(url);
  }

  public home(): void {
    this.router.navigate(['/dashboard']);
  }

  public login(): void {
    this.router.navigate(['/login']);
  }

  public userInfo(id: number): void {
    const url = id ? '/user-info/' + id : '/user-info';
    this.router.navigate([url]);
  }

  public eventDetail(id: number): void {
    const url = id ? '/promotions/' + id : '/promotions';
    this.router.navigate([url]);
  }

  public storeDetail(id: number): void {
    const url = id ? '/chain-stores/' + id : '/chain-stores';
    this.router.navigate([url]);
  }

  public partnerInfo(id: string): void {
    const url = id ? 'warehouse/partners/' + id : '/warehouse';
    this.router.navigate([url]);
  }

  public redirect(url: string, clearStorage: boolean = true): void {
    if (clearStorage) {
      LsHelper.clearStorage();
    }

    window.location.href = url;
  }
}
