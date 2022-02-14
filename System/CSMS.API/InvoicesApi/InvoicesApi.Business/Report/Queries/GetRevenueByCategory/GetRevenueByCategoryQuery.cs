using InvoicesApi.Business.Order.Queries.GetListOrder;
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

namespace InvoicesApi.Business.Report.Queries.GetRevenueByCategory
{
    public class GetRevenueByCategoryQuery : IGetRevenueByCategoryQuery
    {
        private readonly IGetListOrderQuery _getListOrderQuery;
        private readonly IRepository<CsmsOrderDetail> _orderDetailsRepository;

        public GetRevenueByCategoryQuery(
            IGetListOrderQuery getListOrderQuery,
            IRepository<CsmsOrderDetail> orderDetailsRepository)
        {
            _getListOrderQuery = getListOrderQuery;
            _orderDetailsRepository = orderDetailsRepository;
        }

        public async Task<RevenueByCategoryViewModel> ExecuteAsync(DateTime startDate, DateTime endDate)
        {
            var distanceDays = DateTimeExtension.CountDays(startDate, endDate);
            var result = new RevenueByCategoryViewModel();
            var ordersResult = await _getListOrderQuery.ExecuteAsync(0, 0, (int)OrderStatus.Completed, null, startDate, endDate, null);
            var ordersInPastResult = await _getListOrderQuery.ExecuteAsync(0, 0, (int)OrderStatus.Completed, null, startDate.AddDays(-distanceDays), endDate.AddDays(-distanceDays), null);
            var orderDetails = ordersResult.Items.SelectMany(n => n.OrderDetails).Where(n => n.CategoryId.HasValue).ToList();
            var totalRevenue = orderDetails.Sum(n => n.Quantity * n.Price);
            var categories = await _orderDetailsRepository.TableNoTracking
                .Where(n => n.CategoryId.HasValue)
                .Select(n => new CategoryViewModel()
                {
                    CategoryId = n.CategoryId ?? 0,
                    CategoryName = n.CategoryName
                })
                .Distinct()
                .ToListAsync();

            result.StartDate = startDate;
            result.EndDate = endDate;
            result.Details = GetRevenueByCategoryDetail(categories, ordersResult.Items, ordersInPastResult.Items);
            result.CategoryRevenues = orderDetails
                .GroupBy(n => n.CategoryId)
                .Select(n => new CategoryRevenueViewModel()
                {
                    CategoryId = n.Key ?? 0,
                    CategoryName = n.FirstOrDefault()?.CategoryName,
                    TotalRevenue = n.Sum(x => x.Quantity * x.Price),
                    Percent = totalRevenue > 0 ? Math.Round(n.Sum(x => x.Quantity * x.Price) / totalRevenue * 100, 2) : 0
                }).ToList();

            return result;
        }

        private List<RevenueByCategoryListOrdersViewModel> GetRevenueByCategoryDetail(List<CategoryViewModel> categories, CsmsOrder[] orders, CsmsOrder[] ordersInPast)
        {
            List<RevenueByCategoryListOrdersViewModel> result = new List<RevenueByCategoryListOrdersViewModel>();

            foreach (var cat in categories)
            {
                var ordersTemp = orders.SelectMany(n => n.OrderDetails).Where(n => n.CategoryId == cat.CategoryId);
                var ordersInPastTemp = ordersInPast.SelectMany(n => n.OrderDetails).Where(n => n.CategoryId == cat.CategoryId);

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

                result.Add(new RevenueByCategoryListOrdersViewModel()
                {
                    CategoryId = cat.CategoryId,
                    CategoryName = cat.CategoryName,
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
