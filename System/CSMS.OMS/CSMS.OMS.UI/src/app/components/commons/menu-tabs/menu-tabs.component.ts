import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

export class MenuTab {
  public tabId: number;
  public tabName: string;
  public icon: string;
  constructor(tabId: number, tabName: string, icon = null) {
    this.tabId = tabId;
    this.tabName = tabName;
    this.icon = icon;
  }
}

@Component({
  selector: 'app-menu-tabs',
  templateUrl: './menu-tabs.component.html'
})
export class MenuTabsComponent implements OnInit {
  @Input() tabs: MenuTab[] = [];
  @Output() callback: EventEmitter<MenuTab> = new EventEmitter();

  public tabSelected: MenuTab;

  constructor() { }

  ngOnInit() {
    if (this.tabs && this.tabs[0]) {
      this.selectTab(this.tabs[0]);
    }
  }

  selectTab(tab: MenuTab): void {
    this.tabSelected = tab;
    this.callback.emit(this.tabSelected);
  }
}
