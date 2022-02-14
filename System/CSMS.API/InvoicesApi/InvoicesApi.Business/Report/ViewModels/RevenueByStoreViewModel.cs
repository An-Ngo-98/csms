using System;
using System.Collections.Generic;

namespace InvoicesApi.Business.Report.ViewModels
{
    public class RevenueByStoreViewModel
    {
        public RevenueByStoreViewModel()
        {
            this.StoreRevenues = new List<StoreRevenueViewModel>();
            this.Details = new List<RevenueByStoreListOrdersViewModel>();
        }

        public List<StoreRevenueViewModel> StoreRevenues { get; set; }
        public List<RevenueByStoreListOrdersViewModel> Details { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class RevenueByStoreListOrdersViewModel
    {
        public int StoreId { get; set; }
        public string StoreName { get; set; }
        public int TotalInvoices { get; set; }
        public decimal TotalInvoicesPercent { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalRevenuePercent { get; set; }
    }

    public class StoreRevenueViewModel
    {
        public int StoreId { get; set; }
        public string StoreName { get; set; }
        public List<decimal> RevenueByDay { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal Percent { get; set; }
    }
}
