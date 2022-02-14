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

namespace InvoicesApi.Business.Report.Queries.GetRevenueByStore
{
    public class GetRevenueByStoreQuery : IGetRevenueByStoreQuery
    {
        private readonly IGetListOrderQuery _getListOrderQuery;
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetRevenueByStoreQuery(
            IGetListOrderQuery getListOrderQuery,
            IRepository<CsmsOrder> orderRepository)
        {
            _getListOrderQuery = getListOrderQuery;
            _orderRepository = orderRepository;
        }

        public async Task<RevenueByStoreViewModel> ExecuteAsync(DateTime startDate, DateTime endDate)
        {
            var distanceDays = DateTimeExtension.CountDays(startDate, endDate);
            var result = new RevenueByStoreViewModel();
            var ordersResult = await _getListOrderQuery.ExecuteAsync(0, 0, (int)OrderStatus.Completed, null, startDate, endDate, null);
            var ordersInPastResult = await _getListOrderQuery.ExecuteAsync(0, 0, (int)OrderStatus.Completed, null, startDate.AddDays(-distanceDays), endDate.AddDays(-distanceDays), null);
            var totalRevenue = ordersResult.Items.Sum(n => n.Total);
            var stores = await _orderRepository.TableNoTracking
                .Select(n => new StoreViewModel()
                {
                    Id = n.StoreId,
                    Name = n.StoreName
                })
                .Distinct()
                .ToListAsync();

            stores = stores.GroupBy(n => n.Id).Select(n => n.First()).ToList();

            result.StartDate = startDate;
            result.EndDate = endDate;
            result.Details = GetRevenueByStoreDetail(stores, ordersResult.Items, ordersInPastResult.Items);
            result.StoreRevenues = ordersResult.Items
                .GroupBy(n => n.StoreId)
                .Select(n => new StoreRevenueViewModel()
                {
                    StoreId = n.Key,
                    StoreName = n.FirstOrDefault()?.StoreName,
                    RevenueByDay = GetStoreRevenueByDay(n, startDate, endDate),
                    TotalRevenue = (int)n.Sum(x => x.Total),
                    Percent = totalRevenue > 0 ? Math.Round(n.Sum(x => x.Total) / totalRevenue * 100, 2) : 0
                }).ToList();

            return result;
        }

        private List<decimal> GetStoreRevenueByDay(IEnumerable<CsmsOrder> orders, DateTime startDate, DateTime endDate)
        {
            List<decimal> result = new List<decimal>();
            DateTime temp = startDate;

            while (temp < endDate || temp.EqualsUpToDay(endDate))
            {
                var dateFilterData = orders.Where(n => temp.EqualsUpToDay(n.OrderedTime));

                result.Add(dateFilterData.Sum(n => n.Total));
                temp = temp.AddDays(1);
            }

            return result;
        }

        private List<RevenueByStoreListOrdersViewModel> GetRevenueByStoreDetail(List<StoreViewModel> stores, IEnumerable<CsmsOrder> orders, IEnumerable<CsmsOrder> ordersInPast)
        {
            List<RevenueByStoreListOrdersViewModel> result = new List<RevenueByStoreListOrdersViewModel>();

            foreach (var store in stores)
            {
                var ordersTemp = orders.Where(n => n.StoreId == store.Id);
                var ordersInPastTemp = ordersInPast.Where(n => n.StoreId == store.Id);

                decimal totalInvoicesPercent = 100;
                if (ordersInPastTemp.Count() == ordersTemp.Count())
                {
                    totalInvoicesPercent = 0;
                }
                else if (ordersInPastTemp.Count() > 0)
                {
                    totalInvoicesPercent = (ordersTemp.Count() - ordersInPastTemp.Count()) / ordersInPastTemp.Count() * 100;
                }

                decimal totalRevenuePercent = 100;
                if (ordersInPastTemp.Sum(n => n.Total) == ordersTemp.Sum(n => n.Total))
                {
                    totalRevenuePercent = 0;
                }
                else if (ordersInPastTemp.Count() > 0)
                {
                    totalRevenuePercent = (ordersTemp.Sum(n => n.Total) - ordersInPastTemp.Sum(n => n.Total)) / ordersInPastTemp.Sum(n => n.Total) * 100;
                }

                result.Add(new RevenueByStoreListOrdersViewModel()
                {
                    StoreId = store.Id,
                    StoreName = store.Name,
                    TotalInvoices = ordersTemp.Count(),
                    TotalInvoicesPercent = totalInvoicesPercent,
                    TotalRevenue = ordersTemp.Sum(n => n.Total),
                    TotalRevenuePercent = totalRevenuePercent
                });

            }

            return result;
        }
    }
}
