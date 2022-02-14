import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LsHelper } from '../helpers/ls.helper';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {

  // Variables
  private toggle = false;

  // Decorators
  @Input() public id = 'DEFAULT_PAGINATION_ID';
  @Input() public totalCount = 0;
  @Input() public currentPageIndex = 0;
  @Input() public type: string;
  @Input() public pageSize = LsHelper.PAGE_SIZE_DEFAULT;
  @Input() public listPageSize = [10, 20, 50, 100];
  @Input() public savePageSize = true;
  @Output() public onPageChangeEvent: EventEmitter<number> = new EventEmitter();
  @Output() public onPageSizeChangeEvent: EventEmitter<number> = new EventEmitter();

  public static getDefaultPageSize(): number {
    return LsHelper.getPageSize();
  }

  public ngOnInit(): void {
    const pageSizeSaved = LsHelper.getPageSize();
    if (this.listPageSize.find(item => item === pageSizeSaved) && !this.pageSize) {
      this.pageSize = pageSizeSaved;
    }
  }

  public onPageChange(page: number): void {
    this.onPageChangeEvent.emit(page);
  }

  protected getCurrentShowing(): string {
    if (this.totalCount > 0) {
      return (this.pageSize * (this.currentPageIndex - 1) + 1).toString() +
        '-' +
        (this.pageSize * this.currentPageIndex > this.totalCount ?
          this.totalCount ? this.totalCount : 0 :
          this.pageSize * this.currentPageIndex).toString();
    } else {
      return '0 - 0';
    }
  }

  protected getNumOfPages(): number {

    if (this.totalCount <= 0) {
      return 0;
    }

    if (this.totalCount % this.pageSize === 0) {
      return Math.floor(this.totalCount / this.pageSize);
    } else {
      return Math.floor(this.totalCount / this.pageSize + 1);
    }
  }

  protected updatePageSize(): void {
    this.onPageSizeChangeEvent.emit(this.pageSize);
    this.toggle = false;
    if (this.savePageSize) {
      LsHelper.setPageSize(this.pageSize)
    };
  }

  public showShortPagination(i: number): boolean {

    const numOfPage = this.getNumOfPages();

    if (this.getNumOfPages() < 7) {
      return false;
    }

    if ((i === 1 && this.currentPageIndex > 3)
      || (i === numOfPage - 1 && this.currentPageIndex < numOfPage - 3)) {
      return true;
    }

    return false;
  }

  public showNumberPagination(i: number): boolean {

    if (this.getNumOfPages() < 7 || i === 0 || i === this.getNumOfPages() - 1) {
      return true;
    }

    if (i >= this.currentPageIndex - 2 && i <= this.currentPageIndex
      && this.currentPageIndex > 2 && this.currentPageIndex < this.getNumOfPages() - 2) {
      return true;
    }

    if (this.currentPageIndex <= 3 && i <= 3) {
      return true;
    }

    if (this.currentPageIndex >= this.getNumOfPages() - 3 && i >= this.getNumOfPages() - 4) {
      return true;
    }

    return false;
  }
}
