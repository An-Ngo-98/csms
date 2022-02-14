using System;
using System.Collections.Generic;

namespace InvoicesApi.Business.Report.ViewModels
{
    public class RevenueByCategoryViewModel
    {
        public RevenueByCategoryViewModel()
        {
            this.CategoryRevenues = new List<CategoryRevenueViewModel>();
            this.Details = new List<RevenueByCategoryListOrdersViewModel>();
        }

        public List<CategoryRevenueViewModel> CategoryRevenues { get; set; }
        public List<RevenueByCategoryListOrdersViewModel> Details { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class RevenueByCategoryListOrdersViewModel
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int TotalQuantity { get; set; }
        public decimal TotalQuantityPercent { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalRevenuePercent { get; set; }
    }

    public class CategoryRevenueViewModel
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal Percent { get; set; }
    }
}
