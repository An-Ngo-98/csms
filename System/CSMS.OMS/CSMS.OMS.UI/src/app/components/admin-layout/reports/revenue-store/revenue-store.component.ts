import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { RevenueByStoreViewModel } from '../../../../models/report';
import { ReportService } from '../../../../services/statistics/report.service';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import { ColorTable } from '../../../../commons/consts/color.const';

@Component({
  selector: 'app-revenue-store',
  templateUrl: './revenue-store.component.html'
})
export class RevenueStoreComponent implements OnInit {
  public loading = false;
  public ColorTable = ColorTable;
  public today = new Date();
  public startTime: string;
  public endTime: string;
  public revenueData: RevenueByStoreViewModel;

  public canvas: any;
  public ctx;
  public chartStores;
  public chartPercent;

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.startTime = MomentHelper.addDay(this.startTime, -8).format(DateFormat.DateFormatJson);
    this.endTime = MomentHelper.addDay(this.endTime, -1).format(DateFormat.DateFormatJson);

    this.getData();
  }

  public parseDateToString(date: string): string {
    return MomentHelper.formatDate(date, DateFormat.DateOnlyFormatJson);
  }

  public parseDateToJSON(date: string): string {
    return MomentHelper.formatDate(date, DateFormat.DateFormatJson);
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public formatPercent(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    // if (numberInput > 100) {
    //   numberInput = 100;
    // }

    numberInput = numberInput > Math.floor(numberInput) ? +numberInput.toFixed(2) : numberInput;

    return (numberInput < 0 ? -numberInput : numberInput) + '%';
  }

  public getData(): void {
    this.loading = true;
    const startTime = MomentHelper.formatDate(this.startTime, DateFormat.DateFormatMMDDYYYY);
    const endTime = MomentHelper.formatDate(this.endTime, DateFormat.DateFormatMMDDYYYY);

    this.reportService.getRevenueStore(startTime, endTime).subscribe(
      (res) => {
        if (res) {
          this.revenueData = res;
          this.initChartData();
          this.loading = false;
        }
      }
    );
  }

  private initChartData(): void {
    this.canvas = document.getElementById('chartPercent');
    this.ctx = this.canvas.getContext('2d');
    this.chartPercent = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: this.revenueData.storeRevenues.map(item =>
          item.storeName + ': ' + this.formatCurrency(item.totalRevenue) + ' - %'
        ),
        datasets: [{
          label: 'Emails',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ColorTable,
          borderWidth: 0,
          data: this.revenueData.storeRevenues.map(item => item.percent)
        }]
      },
      options: {
        legend: {
          display: false
        }
      }
    });

    const dataset = [];

    this.revenueData.storeRevenues.forEach((item, index) => {
      dataset.push({
        data: item.revenueByDay,
        fill: false,
        label: item.storeName,
        borderColor: ColorTable[index],
        pointBorderColor: ColorTable[index],
        pointRadius: 3,
        pointHoverRadius: 3,
        pointBorderWidth: 4,
      });
    });

    const labels = [];
    let tempDate = new Date(this.revenueData.startDate);
    while (tempDate <= new Date(this.revenueData.endDate)) {
      labels.push(tempDate.getDate() + '/' + (tempDate.getMonth() + 1));
      tempDate = new Date(tempDate.getTime() + (60 * 60 * 24 * 1000));
    }

    this.canvas = document.getElementById('chartStores');
    this.ctx = this.canvas.getContext('2d');
    this.chartStores = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: dataset
      },
      options: {
        legend: {
          display: false,
          position: 'top'
        }
      }
    });
  }
}
