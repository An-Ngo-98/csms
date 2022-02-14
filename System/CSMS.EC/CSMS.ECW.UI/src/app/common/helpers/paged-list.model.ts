import { PaginationComponent } from '../pagination/pagination.component';

export class PagedListModel<T> {
    public pageIndex: number;
    public pageSize: number;
    public totalCount: number;
    public items: T[];

    constructor(
        pageIndex: number = 1, pageSize: number = PaginationComponent.getDefaultPageSize(), totalCount: number = 0) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = [];
    }
}
