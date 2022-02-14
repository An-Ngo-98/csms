import * as fromRoot from '../../../ngrx-store/reducers';
import * as userAction from '../../../ngrx-store/reducers/user/user.action';
import { ApiController } from '../../../commons/consts/api-controller.const';
import { AppService } from '../../../configs/app-service';
import { Component, ElementRef, OnInit, Renderer, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { LsHelper } from '../../../commons/helpers/ls.helper';
import { RoleConstant } from '../../../commons/consts/permission.const';
import { RoleService } from '../../../services/system/role.service';
import { Router } from '@angular/router';
import { RouterService } from '../../../services/router.service';
import { ROUTES } from '../sidebar/sidebar.component';
import { Store } from '@ngrx/store';

@Component({
  moduleId: module.id,
  selector: 'app-navbar-cmp',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {

  private avatarSize = 50;

  public shortName: string;
  public avatarUrl: string;
  public userId: number;

  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  public isCollapsed = true;
  @ViewChild('navbar-cmp', { static: false }) button;

  constructor(
    location: Location,
    private renderer: Renderer,
    private element: ElementRef,
    private router: Router,
    private store: Store<fromRoot.State>,
    private routeService: RouterService,
    private roleService: RoleService) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });

    this.store.select(fromRoot.getCurrentUser).subscribe((res) => {
      this.userId = res.id;
      this.shortName = res.firstName + ' ' + res.lastName;
      this.avatarUrl = AppService.getPath(ApiController.CdnApi.UserAvatar + 'save-cache/' + res.id + '/' + this.avatarSize);
    });
  }
  getTitle() {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice(1);
    }
    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === title) {
        return this.listTitles[item].title;
      }
    }
    return '';
  }
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');
    if (window.innerWidth < 991 && mainPanel) {
      mainPanel.style.position = 'fixed';
    }
    this.sidebarVisible = true;
  };
  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    if (window.innerWidth < 991 && mainPanel) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };
  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }
  logout() {
    LsHelper.clearStorage();
    this.store.dispatch(new userAction.Logout(null));
    this.routeService.login();
  }

  public isAdmin(): boolean {
    return this.roleService.hasPermission(RoleConstant.ADMIN);
  }
}
