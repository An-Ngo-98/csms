using InvoicesApi.Business.Order.Queries.GetListOrder;
using InvoicesApi.Business.Statistic.ViewModels;
using InvoicesApi.Business.User.Queries.GetNumOfNewCustomers;
using InvoicesApi.Common.Enums;
using InvoicesApi.Common.Extentions;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Statistic.Queries.GetStatisticData
{
    public class GetStatisticDataQuery : IGetStatisticDataQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;
        private readonly IGetNumOfNewCustomersQuery _getNumOfNewCustomersQuery;
        private readonly IGetListOrderQuery _getListOrderQuery;

        public GetStatisticDataQuery(
            IRepository<CsmsOrder> orderRepository,
            IGetNumOfNewCustomersQuery getNumOfNewCustomersQuery,
            IGetListOrderQuery getListOrderQuery)
        {
            _orderRepository = orderRepository;
            _getNumOfNewCustomersQuery = getNumOfNewCustomersQuery;
            _getListOrderQuery = getListOrderQuery;
        }

        public async Task<StatisticViewModel> ExecuteAsync(DateTime startDate, DateTime endDate)
        {
            startDate = startDate.ChangeTime(0, 0, 0, 0);
            endDate = endDate.ChangeTime(23, 59, 59, 999);

            DateTime now = DateTime.Now;
            DateTime startTimeToday = now.ChangeTime(0, 0, 0, 0);
            StatisticViewModel result = new StatisticViewModel(startDate, endDate);

            var numOfNewCustomers = await _getNumOfNewCustomersQuery.ExecuteAsync(startDate, endDate);
            var ordersResult = await _getListOrderQuery.ExecuteAsync(0, 0, null, null, startDate, endDate, null);
            var todayOrdersResult = await _getListOrderQuery.ExecuteAsync(0, 0, null, null, startTimeToday, now, null);

            result.NumOfNewCustomers = numOfNewCustomers;
            result.NumOfNewOrders = ordersResult.Items.Count();
            result.NumOfNewInvoices = ordersResult.Items.Where(n => n.CompletedTime.HasValue).Count();
            result.FeaturedCategories = GetFeaturedCategories(ordersResult.Items.Where(n => n.CompletedTime.HasValue));
            result.BestSellingProducts = GetBestSellingProducts(ordersResult.Items.Where(n => n.CompletedTime.HasValue));
            result.CurrentOrder = GetCurrentOrder(todayOrdersResult.Items);
            result.RevenueOverview = GetRevenueOverview(todayOrdersResult.Items);
            result.LatestOrders = GetLatestOrders(todayOrdersResult.Items);

            return result;
        }

        private string GetStatusOrder(CsmsOrder order)
        {
            if (order.CanceledTime != null)
            {
                return "Canceled";
            }

            if (order.CookedTime == null)
            {
                return "Pending";
            }

            if (order.ShippedTime == null)
            {
                return "Cooking";
            }

            if (order.CompletedTime == null)
            {
                return "Shipping";
            }

            if (order.CompletedTime != null)
            {
                return "Completed";
            }

            return "N/A";
        }

        private List<FeaturedCategoryViewModel> GetFeaturedCategories(IEnumerable<CsmsOrder> orders)
        {
            var details = orders.SelectMany(n => n.OrderDetails).ToList();
            decimal total = details.Sum(n => n.Quantity * n.Price);

            var result = details.Where(n => !string.IsNullOrEmpty(n.CategoryName))
                .GroupBy(n => n.CategoryId)
                .Select(n => new FeaturedCategoryViewModel()
                {
                    CategoryName = n.First().CategoryName,
                    Revenue = n.Sum(x => x.Price * x.Quantity),
                    Percent = Math.Round(((n.Sum(x => x.Price * x.Quantity) / total) * 100), 2)
                })
                .Distinct()
                .OrderByDescending(n => n.Revenue)
                .ToList();

            return result;
        }

        private List<BestSellingProductViewModel> GetBestSellingProducts(IEnumerable<CsmsOrder> orders)
        {
            var details = orders.SelectMany(n => n.OrderDetails).ToList();
            decimal total = details.Sum(n => n.Quantity * n.Price);

            var result = details.GroupBy(n => n.CategoryId)
                .Select(n => new BestSellingProductViewModel()
                {
                    ProductName = n.First().ProductName,
                    Revenue = n.Sum(x => x.Price * x.Quantity),
                    Quantity = n.Sum(x => x.Quantity)
                })
                .Distinct()
                .OrderByDescending(n => n.Quantity)
                .ToList();

            return result;
        }

        private CurrentOrderViewModel GetCurrentOrder(IEnumerable<CsmsOrder> orders)
        {
            CurrentOrderViewModel result = new CurrentOrderViewModel();
            result.Pending = orders.Where(n => !n.CookedTime.HasValue && !n.CanceledTime.HasValue).Count();
            result.Cooking = orders.Where(n => n.CookedTime.HasValue && !n.ShippedTime.HasValue && !n.CanceledTime.HasValue).Count();
            result.Shipping = orders.Where(n => n.CookedTime.HasValue && n.ShippedTime.HasValue && !n.CompletedTime.HasValue && !n.CanceledTime.HasValue).Count();
            result.Total = orders.Where(n => !n.CompletedTime.HasValue && !n.CanceledTime.HasValue).Sum(n => n.Total);

            return result;
        }

        private RevenueViewModel GetRevenueOverview(IEnumerable<CsmsOrder> orders)
        {
            RevenueViewModel result = new RevenueViewModel();
            result.Total = orders.Where(n => n.CompletedTime.HasValue).Sum(n => n.Total);
            result.CompletedOrders = orders.Where(n => n.CompletedTime.HasValue).Count();
            result.CanceledOrders = orders.Where(n => n.CanceledTime.HasValue).Count();
            result.TotalOrders = result.CompletedOrders + result.CanceledOrders;

            return result;
        }

        private List<LatestOrderViewModel> GetLatestOrders(IEnumerable<CsmsOrder> orders)
        {
            var result = orders.Select(n => new LatestOrderViewModel()
            {
                OrderId = n.Id,
                OrderedTime = n.OrderedTime,
                Store = n.StoreName,
                Total = n.Total,
                Status = GetStatusOrder(n)
            }).ToList();

            return result;
        }
    }
}
