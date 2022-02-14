using System;
using System.Collections.Generic;
using System.Linq;

namespace InvoicesApi.Business.Report.ViewModels
{
    public class BestSellingProductsViewModel
    {
        public BestSellingProductsViewModel()
        {
            this.PercentageProductRevenues = new List<PercentageProductRevenuesViewModel>();
            this.PercentageProductQuantity = new List<PercentageProductQuantityViewModel>();
            this.Details = new List<ProductListOrdersViewModel>();
        }

        public List<PercentageProductRevenuesViewModel> PercentageProductRevenues { get; set; }
        public List<PercentageProductQuantityViewModel> PercentageProductQuantity { get; set; }
        public List<ProductListOrdersViewModel> Details { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public void CalculateChartData()
        {
            foreach (var prod in this.Details)
            {
                this.PercentageProductRevenues.Add(new PercentageProductRevenuesViewModel()
                {
                    ProductId = prod.ProductId,
                    ProductName = prod.ProductName,
                    TotalRevenue = prod.TotalRevenue,
                    Percent = this.Details.Sum(n => n.TotalRevenue) > 0 ? Math.Round(prod.TotalRevenue / this.Details.Sum(n => n.TotalRevenue) * 100, 2) : 0
                });

                this.PercentageProductQuantity.Add(new PercentageProductQuantityViewModel()
                {
                    ProductId = prod.ProductId,
                    ProductName = prod.ProductName,
                    TotalQuantity = prod.TotalQuantity,
                    Percent = this.Details.Sum(n => n.TotalQuantity) > 0 ? Math.Round((decimal)prod.TotalQuantity / this.Details.Sum(n => n.TotalQuantity) * 100, 2) : 0
                });
            }
        }
    }

    public class ProductListOrdersViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int TotalQuantity { get; set; }
        public decimal TotalQuantityPercent { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalRevenuePercent { get; set; }
    }

    public class PercentageProductRevenuesViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal Percent { get; set; }
    }

    public class PercentageProductQuantityViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal TotalQuantity { get; set; }
        public decimal Percent { get; set; }
    }
}
