import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { BestSellingProductsViewModel } from '../../../../models/report';
import { ReportService } from '../../../../services/statistics/report.service';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import { ColorTable } from '../../../../commons/consts/color.const';

@Component({
  selector: 'app-best-selling-products',
  templateUrl: './best-selling-products.component.html'
})
export class BestSellingProductsComponent implements OnInit {
  public loading = false;
  public ColorTable = ColorTable;
  public today = new Date();
  public startTime: string;
  public endTime: string;
  public revenueData: BestSellingProductsViewModel;

  public canvas: any;
  public ctx;
  public chartPercentRevenueProduct;
  public chartPercentAmountProduct;

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

    this.reportService.getBestSellingProducts(startTime, endTime).subscribe(
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
    this.canvas = document.getElementById('chartPercentRevenueProduct');
    this.ctx = this.canvas.getContext('2d');
    this.chartPercentRevenueProduct = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: this.revenueData.percentageProductRevenues.map(item =>
          item.productName + ': ' + this.formatCurrency(item.totalRevenue) + ' - %'
        ),
        datasets: [{
          label: 'Sold Products',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ColorTable,
          borderWidth: 0,
          data: this.revenueData.percentageProductRevenues.map(item => item.percent)
        }]
      },
      options: {
        legend: {
          display: false
        }
      }
    });

    this.canvas = document.getElementById('chartPercentQuantityProduct');
    this.ctx = this.canvas.getContext('2d');
    this.chartPercentAmountProduct = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: this.revenueData.percentageProductQuantity.map(item =>
          item.productName + ': ' + item.totalQuantity + ' products - %'
        ),
        datasets: [{
          label: 'Revenue Product',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ColorTable,
          borderWidth: 0,
          data: this.revenueData.percentageProductQuantity.map(item => item.percent)
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
