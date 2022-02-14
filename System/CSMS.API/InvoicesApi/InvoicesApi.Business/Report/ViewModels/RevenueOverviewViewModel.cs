using System;
using System.Collections.Generic;

namespace InvoicesApi.Business.Report.ViewModels
{
    public class RevenueOverviewViewModel
    {
        public RevenueOverviewViewModel()
        {
            this.AvgRevenuePerHour = new List<ChartDataViewModel>();
            this.RevenuePerDay = new List<ChartDataViewModel>();
        }

        public decimal TotalProceeds { get; set; }
        public int NumOfTransactions { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal AvgPerTransaction { get; set; }
        public int NumbOfCoinsRefunded { get; set; }
        public List<ChartDataViewModel> AvgRevenuePerHour { get; set; }
        public List<ChartDataViewModel> RevenuePerDay { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
