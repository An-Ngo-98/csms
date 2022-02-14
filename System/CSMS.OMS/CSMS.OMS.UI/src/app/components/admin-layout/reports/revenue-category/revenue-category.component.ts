import Chart from 'chart.js';
import { Component, OnInit } from '@angular/core';
import { RevenueByCategoryViewModel } from 'app/models/report';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import { ReportService } from '../../../../services/statistics/report.service';
import { ColorTable } from '../../../../commons/consts/color.const';

@Component({
  selector: 'app-revenue-category',
  templateUrl: './revenue-category.component.html'
})
export class RevenueCategoryComponent implements OnInit {
  public loading = false;
  public ColorTable = ColorTable;
  public today = new Date();
  public startTime: string;
  public endTime: string;
  public revenueData: RevenueByCategoryViewModel;

  public canvas: any;
  public ctx;
  public chartPercentCategory;

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

    this.reportService.getRevenueCategory(startTime, endTime).subscribe(
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
    this.canvas = document.getElementById('chartPercentCategory');
    this.ctx = this.canvas.getContext('2d');
    this.chartPercentCategory = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: this.revenueData.categoryRevenues.map(item =>
          item.categoryName + ': ' + this.formatCurrency(item.totalRevenue) + ' - %'
        ),
        datasets: [{
          label: 'Emails',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ColorTable,
          borderWidth: 0,
          data: this.revenueData.categoryRevenues.map(item => item.percent)
        }]
      },
      options: {
        legend: {
          display: false
        }
      }
    });
  }
}
