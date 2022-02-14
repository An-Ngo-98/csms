import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import { ReportService } from '../../../../services/statistics/report.service';
import { RevenueOverviewViewModel } from '../../../../models/report';

@Component({
  selector: 'app-revenue-overview',
  templateUrl: './revenue-overview.component.html'
})
export class RevenueOverviewComponent implements OnInit {
  public loading = false;
  public today = new Date();
  public startTime: string;
  public endTime: string;
  public revenueData: RevenueOverviewViewModel;

  public canvas: any;
  public ctx;
  public chartHours;
  public chartDays;

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.startTime = MomentHelper.addDay(this.startTime, -8).format(DateFormat.DateFormatJson);
    this.endTime = MomentHelper.addDay(this.endTime, -1).format(DateFormat.DateFormatJson);

    this.getData();
  }

  public parseDateToString(date: string): string {
    return MomentHelper.formatDate(date, DateFormat.DateOnlyFormatJson);
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public getData(): void {
    this.loading = true;
    const startTime = MomentHelper.formatDate(this.startTime, DateFormat.DateFormatMMDDYYYY);
    const endTime = MomentHelper.formatDate(this.endTime, DateFormat.DateFormatMMDDYYYY);

    this.reportService.getRevenueOverview(startTime, endTime).subscribe(
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
    this.canvas = document.getElementById('chartHours');
    this.ctx = this.canvas.getContext('2d');

    this.chartHours = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.revenueData.avgRevenuePerHour.map(item => item.key),
        datasets: [{
          label: 'Average revenue per hour (Unit: VND)',
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          data: this.revenueData.avgRevenuePerHour.map(item => item.value),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          xAxes: [{
            gridLines: {
              offsetGridLines: true
            }
          }],
          yAxes: [{ ticks: { beginAtZero: true } }]
        }
      }
    });

    this.canvas = document.getElementById('chartDays');
    this.ctx = this.canvas.getContext('2d');

    this.chartDays = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.revenueData.revenuePerDay.map(item => item.key),
        datasets: [{
          label: 'Revenue by day (Unit: VND)',
          data: this.revenueData.revenuePerDay.map(item => item.value),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          lineTension: 0.1
        }]
      }
    });
  }
}
