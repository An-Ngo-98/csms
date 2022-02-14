using InvoicesApi.Business.Order.Queries.GetListOrder;
using InvoicesApi.Business.Order.ViewModels;
using InvoicesApi.Common.Enums;
using InvoicesApi.Common.Extentions;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.GetTodayOrders
{
    public class GetTodayOrdersQuery : IGetTodayOrdersQuery
    {
        private readonly IGetListOrderQuery _getListOrderQuery;

        public GetTodayOrdersQuery(IGetListOrderQuery getListOrderQuery)
        {
            _getListOrderQuery = getListOrderQuery;
        }

        public async Task<TodayOrderViewModel> ExecuteAsync(int orderStatus, string storeIds)
        {
            try
            {
                DateTime now = DateTime.Now;
                DateTime startDate = now.ChangeTime(0, 0, 0, 0);
                int[] listStoreIds = !string.IsNullOrEmpty(storeIds) ? storeIds.Split(',').Select(int.Parse).ToArray() : new int[0];

                var orders = await _getListOrderQuery.ExecuteAsync(0, 0, null, null, startDate, now, null, listStoreIds);

                TodayOrderViewModel result = new TodayOrderViewModel();
                result.TimeNow = now;
                result.OrderStatusSelected = orderStatus;
                result.StoreIdsSelected = listStoreIds;

                // Pending orders
                var temp = orders.Items.Where(x =>
                            (x.Id[0] != 'T') &&
                            (x.CookedTime == null) &&
                            (x.ShippedTime == null) &&
                            (x.CompletedTime == null) &&
                            (x.CanceledTime == null));
                result.TotalPending = temp.Count();
                result.Items = orderStatus == (int)OrderStatus.Pending ? temp.ToList() : result.Items;

                // Cooking orders
                temp = orders.Items.Where(x =>
                            (x.Id[0] != 'T') &&
                            (x.CookedTime.HasValue) &&
                            (x.ShippedTime == null) &&
                            (x.CompletedTime == null) &&
                            (x.CanceledTime == null));
                result.TotalCooking = temp.Count();
                result.Items = orderStatus == (int)OrderStatus.Cooking ? temp.ToList() : result.Items;

                // Shipping orders
                temp = orders.Items.Where(x =>
                            (x.Id[0] != 'T') &&
                            (x.CookedTime.HasValue) &&
                            (x.ShippedTime.HasValue) &&
                            (x.CompletedTime == null) &&
                            (x.CanceledTime == null));
                result.TotalShipping = temp.Count();
                result.Items = orderStatus == (int)OrderStatus.Shipping ? temp.ToList() : result.Items;

                // Canceled orders
                temp = orders.Items.Where(x => x.CanceledTime.HasValue);
                result.TotalCanceled = temp.Count();
                result.Items = orderStatus == (int)OrderStatus.Canceled ? temp.ToList() : result.Items;

                // Completed orders
                temp = orders.Items.Where(x => x.CompletedTime.HasValue);
                result.TotalCompleted = temp.Count();
                result.Items = orderStatus == (int)OrderStatus.Completed ? temp.ToList() : result.Items;

                if (orderStatus == (int)OrderStatus.Pending || orderStatus == (int)OrderStatus.Cooking || orderStatus == (int)OrderStatus.Shipping)
                {
                    result.Items.AddRange(orders.Items.Where(x => x.Id[0] == 'T').ToList());
                }

                return result;
            }
            catch (Exception)
            {
                return new TodayOrderViewModel();
            }
        }
    }
}
