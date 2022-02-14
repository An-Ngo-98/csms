using InvoicesApi.Business.Order.Queries.GetListOrder;
using InvoicesApi.Business.Order.ViewModels;
using InvoicesApi.Business.Report.Helpers;
using InvoicesApi.Business.Report.ViewModels;
using InvoicesApi.Common.Enums;
using InvoicesApi.Common.Extentions;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Report.Queries.GetBestSellingProducts
{
    public class GetBestSellingProductsQuery : IGetBestSellingProductsQuery
    {
        private readonly IGetListOrderQuery _getListOrderQuery;
        private readonly IRepository<CsmsOrderDetail> _orderDetailsRepository;

        public GetBestSellingProductsQuery(
            IGetListOrderQuery getListOrderQuery,
            IRepository<CsmsOrderDetail> orderDetailsRepository)
        {
            _getListOrderQuery = getListOrderQuery;
            _orderDetailsRepository = orderDetailsRepository;
        }

        public async Task<BestSellingProductsViewModel> ExecuteAsync(DateTime startDate, DateTime endDate)
        {
            var distanceDays = DateTimeExtension.CountDays(startDate, endDate);
            var result = new BestSellingProductsViewModel();
            var ordersResult = await _getListOrderQuery.ExecuteAsync(0, 0, (int)OrderStatus.Completed, null, startDate, endDate, null);
            var ordersInPastResult = await _getListOrderQuery.ExecuteAsync(0, 0, (int)OrderStatus.Completed, null, startDate.AddDays(-distanceDays), endDate.AddDays(-distanceDays), null);
            var products = await _orderDetailsRepository.TableNoTracking
                .Select(n => new ProductChartViewModel()
                {
                    ProductId = n.ProductId,
                    ProductName = n.ProductName
                })
                .Distinct()
                .ToListAsync();

            result.StartDate = startDate;
            result.EndDate = endDate;
            result.Details = GetRevenueByProductDetail(products, ordersResult.Items, ordersInPastResult.Items);
            result.CalculateChartData();

            return result;
        }

        private List<ProductListOrdersViewModel> GetRevenueByProductDetail(List<ProductChartViewModel> products, CsmsOrder[] orders, CsmsOrder[] ordersInPast)
        {
            List<ProductListOrdersViewModel> result = new List<ProductListOrdersViewModel>();

            foreach (var prod in products)
            {
                var ordersTemp = orders.SelectMany(n => n.OrderDetails).Where(n => n.ProductId == prod.ProductId);
                var ordersInPastTemp = ordersInPast.SelectMany(n => n.OrderDetails).Where(n => n.ProductId == prod.ProductId);

                decimal totalQuantityInPast = ordersInPastTemp.Sum(n => n.Quantity);
                decimal totalQuantityNow = ordersTemp.Sum(n => n.Quantity);
                decimal totalRevenueInPast = ordersInPastTemp.Sum(n => n.Price * n.Quantity);
                decimal totalRevenueNow = ordersTemp.Sum(n => n.Price * n.Quantity);

                decimal totalQuantityPercent = 100;
                if (totalQuantityInPast == totalQuantityNow)
                {
                    totalQuantityPercent = 0;
                }
                else if (totalQuantityInPast > 0)
                {
                    totalQuantityPercent = (totalQuantityNow - totalQuantityInPast) / totalQuantityInPast * 100;
                }

                decimal totalRevenuePercent = 100;
                if (totalRevenueInPast == totalRevenueNow)
                {
                    totalRevenuePercent = 0;
                }
                else if (totalQuantityInPast > 0)
                {
                    totalRevenuePercent = (totalRevenueNow - totalRevenueInPast) / totalRevenueInPast * 100;
                }

                result.Add(new ProductListOrdersViewModel()
                {
                    ProductId = prod.ProductId,
                    ProductName = prod.ProductName,
                    TotalQuantity = ordersTemp.Sum(n => n.Quantity),
                    TotalQuantityPercent = totalQuantityPercent,
                    TotalRevenue = ordersTemp.Sum(n => n.Price * n.Quantity),
                    TotalRevenuePercent = totalRevenuePercent
                });
            }

            return result.OrderByDescending(n => n.TotalRevenue).ToList();
        }
    }
}
