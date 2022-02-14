import * as fromRoot from '../../../ngrx-store/reducers';
import { ActivatedRoute } from '@angular/router';
import { ApiController } from '../../../commons/consts/api-controller.const';
import { AppService } from '../../../configs/app-service';
import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Message } from '../../../commons/consts/message.const';
import { NotificationService } from '../../../services/notification.service';
import { RouterService } from '../../../services/router.service';
import { UserService } from '../../../services/user/user.service';
import { UserViewModel } from '../../../models/admin-space/user.model';
import { zip } from 'rxjs';

@Component({
    selector: 'app-user-info',
    moduleId: module.id,
    templateUrl: 'user-info.component.html'
})

export class UserInfoComponent implements OnInit {

    private avatarSize = 124;
    public avatarUrl = '';
    public loading = false;
    private userId: number;
    public user: UserViewModel;
    public avatarUpload: File;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private routerService: RouterService) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params) {
                this.userId = params['id'];
                this.initData();
            } else {
                this.routerService.notFound();
            }
        });
    }

    private initData() {
        this.userService.getUserInfo(this.userId).subscribe((res) => {
            if (res) {
                this.user = res;
                this.avatarUrl = AppService.getPath(ApiController.CdnApi.UserAvatar + this.user.id + '/' + this.avatarSize);
            } else {
                this.routerService.notFound();
            }
        });
    }

    public onUpload(files: FileList) {
        this.loading = true;
        this.avatarUpload = files.item(0);
        this.userService.updateUserAvatar(this.userId, this.avatarUpload)
            .subscribe((res: any) => {
                this.loading = false;
                if (res && res.succeeded) {
                    this.avatarUrl += '?refresh=' + (new Date()).getTime();
                    this.notificationService.success(Message.SaveSuccess);
                } else if (res && !res.succeeded) {
                    this.notificationService.error(Message.SaveFail + ' - ' + res.errors[0].description);
                }
            }, (err) => {
                this.loading = false;
                this.notificationService.error(Message.SaveFail);
            });
    }

    public shortName(): string {
        return this.user.firstName + ' ' + this.user.lastName;
    }

    public fullName(): string {
        if (this.user.middleName) {
            return this.user.firstName + ' ' + this.user.middleName + ' ' + this.user.lastName;
        } else {
            return this.shortName();
        }
    }
}
