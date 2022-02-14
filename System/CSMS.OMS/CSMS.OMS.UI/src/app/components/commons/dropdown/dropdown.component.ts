import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

export class DropDownData {
  public key: any;
  public value: any;
  public description: any;
  public icon: any;
  public extendClass: any;
  public separateLine = false;
  public enabled = true;

  constructor(
    key: any = 0,
    value: any,
    description: any = null,
    separateLine: boolean = false,
    icon: any = null,
    extendClass: any = null,
    enabled: boolean = true) {
    this.key = key;
    this.value = value;
    this.description = description;
    this.icon = icon;
    this.extendClass = extendClass;
    this.separateLine = separateLine;
    this.enabled = enabled;
  }
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements OnInit, OnChanges {

  // Input
  @Input() public listData: DropDownData[];
  @Input() public defaultValue: string;
  @Input() public disabled = false;
  @Input() public selectedItemId: any = -1;
  @Input() public allowNoSelect = false;
  @Input() public placeholder = '';
  @Input() public required = false;
  @Input() public useAllItem = false;

  // Output
  @Output() public selectedItemEmit: EventEmitter<DropDownData> = new EventEmitter();

  // Variables
  public selectedItem: DropDownData;
  private readonly EmptyDataId: number = -2;

  constructor() { }

  ngOnInit() {
    this.handleListData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.listData || changes.selectedItemId) {
      this.handleListData();
    }
  }

  public selectItem(item: DropDownData): void {
    if (item.enabled) {
      this.defaultValue = null;
      item = this.listData.find(x => x.key === item.key);
      this.selectedItem = item;
      this.selectedItemEmit.emit(item);
      event.preventDefault();
    }
  }

  private defaultSelectItem(): void {
    if (!this.listData || this.listData.length === 0) {
      this.selectedItem = new DropDownData(-1, this.placeholder !== '' ? this.placeholder : 'Please select');
      return;
    }

    let item = this.listData.find((x) => x.key === this.selectedItemId);
    item = item ? item : this.listData.find((x) => x.value === this.selectedItemId);
    if (item) {
      this.defaultValue = null;
      this.selectedItemEmit.emit(item);
    }

    this.selectedItem = item ? item :
      new DropDownData(-1, this.placeholder !== '' ? this.placeholder : 'Please select');
    if (this.selectedItemId === null) {
      this.selectedItem = new DropDownData(null, 'None', null, true);
    }
    if (this.selectedItemId === this.EmptyDataId) {
      this.selectedItem = new DropDownData(null, '');
    }
  }

  private handleListData(): void {
    if (this.listData) {
      if (this.allowNoSelect && !this.required) {
        const noneData = this.listData.some((dropdownValue) => {
          return dropdownValue.key === null && dropdownValue.value === 'None';
        });
        if (!noneData) {
          this.listData.unshift(new DropDownData(null, 'None', null, true));
        }
      }
      if (this.useAllItem) {
        const test = this.listData.some((dropdownValue) => {
          return dropdownValue.key.toString() === '0' || dropdownValue.key === 'All';
        });
        if (!test) {
          this.listData.unshift(new DropDownData(0, 'All'));
        }
      }
    }

    this.defaultSelectItem();
  }

  public showItem(item: DropDownData) {
    return item.description ? item.value + ' - ' + item.description : item.value;
  }
}
