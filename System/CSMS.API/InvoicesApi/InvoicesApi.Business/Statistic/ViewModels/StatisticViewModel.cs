using System;
using System.Collections.Generic;

namespace InvoicesApi.Business.Statistic.ViewModels
{
    public class StatisticViewModel
    {
        public StatisticViewModel(DateTime startTime, DateTime endTime)
        {
            this.StartTime = startTime;
            this.EndTime = endTime;
        }

        public int NumOfNewCustomers { get; set; }
        public int NumOfNewOrders { get; set; }
        public int NumOfNewInvoices { get; set; }
        public CurrentOrderViewModel CurrentOrder { get; set; }
        public RevenueViewModel RevenueOverview { get; set; }
        public List<FeaturedCategoryViewModel> FeaturedCategories { get; set; }
        public List<BestSellingProductViewModel> BestSellingProducts { get; set; }
        public List<LatestOrderViewModel> LatestOrders { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime CurrentTime { get; set; } = DateTime.Now;
    }

    public class CurrentOrderViewModel
    {
        public decimal Total { get; set; }
        public int Pending { get; set; }
        public int Cooking { get; set; }
        public int Shipping { get; set; }
    }

    public class RevenueViewModel
    {
        public decimal Total { get; set; }
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CanceledOrders { get; set; }
    }

    public class FeaturedCategoryViewModel
    {
        public decimal Percent { get; set; }
        public decimal Revenue { get; set; }
        public string CategoryName { get; set; }
    }

    public class BestSellingProductViewModel
    {
        public int Quantity { get; set; }
        public decimal Revenue { get; set; }
        public string ProductName { get; set; }
    }

    public class LatestOrderViewModel
    {
        public string OrderId { get; set; }
        public string Store { get; set; }
        public DateTime OrderedTime { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; }
    }
}
