import { Component, OnInit } from '@angular/core';
import { DateFormat } from '../../../commons/consts/date-format.const';
import { map } from 'rxjs/operators';
import { MomentHelper } from '../../../commons/helpers/moment.helper';
import { RoleConstant } from '../../../commons/consts/permission.const';
import { StatisticService } from '../../../services/statistics/statistic.service';
import { StatisticViewModel } from '../../../models/admin-space/statistic.model';
import { zip } from 'rxjs';

@Component({
    selector: 'app-dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    public now: Date = new Date();
    public startDate: Date = new Date();
    public endDate: Date = new Date();
    public statisticData: StatisticViewModel;
    public numOfNewUsers: number;
    public RoleConstant = RoleConstant;

    constructor(private statisticService: StatisticService) {
        this.startDate.setDate(this.startDate.getDate() - 8);
        this.endDate.setDate(this.endDate.getDate() - 1);

        setInterval(() => {
            this.now = new Date();
        }, 1000);
    }

    ngOnInit() {
        this.initData();
    }

    public parseDateToString(date: string): string {
        return MomentHelper.formatDate(date, DateFormat.DateOnlyFormatJson);
    }

    public parseDateTimeToString(date: string): string {
        return MomentHelper.formatDate(date, DateFormat.DateTimeFormatDDMMYYYYHHmm);
    }

    public getUpdatedTime(dateInput: Date): string {
        const minute = +((+this.now - +(new Date(dateInput))) / (1000 * 60)).toFixed(0);
        if (minute < 1) {
            return 'Just updated';
        } else if (minute < 2) {
            return 'Updated 1 minute ago';
        } else {
            return 'Updated ' + minute + ' minutes ago';
        }
    }

    public formatCurrency(numberInput: number): string {
        if (!numberInput && numberInput !== 0) {
            return 'N/A';
        }

        return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
    }

    private initData(): void {
        const startDate = MomentHelper.formatDate(this.startDate, DateFormat.DateFormatCSharp);
        const endDate = MomentHelper.formatDate(this.endDate, DateFormat.DateFormatCSharp);
        zip(
            this.statisticService.getNumOfNewUsers(startDate, endDate),
            this.statisticService.getStatisticData(startDate, endDate)
        ).pipe(
            map(
                ([numOfNewUsers, statisticData]) => {
                    this.numOfNewUsers = numOfNewUsers;
                    this.statisticData = statisticData;
                })
        ).subscribe();
    }
}
