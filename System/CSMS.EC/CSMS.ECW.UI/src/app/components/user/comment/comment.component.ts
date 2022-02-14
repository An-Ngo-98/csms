import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/components/base.component';
import { Store, select } from '@ngrx/store';
import { AppState, GetReviewByUserId, GetInfoFromToken } from 'app/store';
import { userSelector, UserLoading, userReviewSelector, userLoadingSelector } from 'app/store/reducers/user.reducer';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { UserItemReview } from 'app/models/user.model';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent extends BaseComponent implements OnInit {
  dataSource: MatTableDataSource<UserItemReview>;
  public imgSize = 70;
  public loading$: Observable<UserLoading>;
  displayedColumns: string[] = ['productName', 'image', 'score', 'title', 'comment', 'reviewTime'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private store: Store<AppState>
  ) {
    super();
    this._subscription.add(
      this.store.pipe(select(userSelector)).subscribe(user => {
        if (user) {
          this.store.dispatch(new GetReviewByUserId(user.id))
        }
      })
    );
   }

  ngOnInit() {
    this.store.pipe(select(userReviewSelector)).subscribe(reviews => {
      if (reviews) {
        this.dataSource = new MatTableDataSource<UserItemReview>(reviews);
        this.dataSource.paginator = this.paginator;
      }
    })
    this.store.dispatch(new GetInfoFromToken(localStorage.getItem('token')));
    this.loading$ = this.store.pipe(select(userLoadingSelector));
  }

  public getImg(id) {
    return AppService.getPath(ApiController.CdnApi.ProductPhoto + id + '/' + this.imgSize)
  }

}
