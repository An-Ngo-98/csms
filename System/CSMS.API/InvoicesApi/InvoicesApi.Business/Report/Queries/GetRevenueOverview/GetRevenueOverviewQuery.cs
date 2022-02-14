using InvoicesApi.Business.Order.Queries.GetListOrder;
using InvoicesApi.Business.Report.ViewModels;
using InvoicesApi.Common.Extentions;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Report.Queries.GetRevenueOverview
{
    public class GetRevenueOverviewQuery : IGetRevenueOverviewQuery
    {
        private readonly IGetListOrderQuery _getListOrderQuery;

        public GetRevenueOverviewQuery(IGetListOrderQuery getListOrderQuery)
        {
            _getListOrderQuery = getListOrderQuery;
        }

        public async Task<RevenueOverviewViewModel> ExecuteAsync(DateTime startTime, DateTime endTime)
        {
            RevenueOverviewViewModel result = new RevenueOverviewViewModel();
            var ordersResult = await _getListOrderQuery.ExecuteAsync(0, 0, null, null, startTime, endTime, null);

            result.StartTime = startTime;
            result.EndTime = endTime;
            result.TotalProceeds = ordersResult.Items.Where(n => n.CompletedTime.HasValue).Sum(n => n.Total);
            result.NumOfTransactions = ordersResult.Items.Where(n => n.CompletedTime.HasValue).Count();
            result.TotalDiscount = ordersResult.Items.Where(n => n.CompletedTime.HasValue).Sum(n => n.DiscountVoucherApplied ?? 0);
            result.AvgPerTransaction = result.NumOfTransactions > 0 ? (int)(result.TotalProceeds / result.NumOfTransactions) : 0;
            result.NumbOfCoinsRefunded = ordersResult.Items.Where(n => n.CompletedTime.HasValue).Sum(n => n.EarnedCoins);

            if (startTime.Hour <= endTime.Hour)
            {
                for (int hour = startTime.Hour; hour <= endTime.Hour; hour++)
                {
                    var hourFilterData = ordersResult.Items.Where(n => n.CompletedTime.HasValue && n.CompletedTime?.Hour == hour);
                    result.AvgRevenuePerHour.Add(new ChartDataViewModel()
                    {
                        Key = hour.ToString(),
                        Value = hourFilterData.Count() > 0 ? hourFilterData.Sum(n => n.Total) / hourFilterData.Count() : 0
                    });
                }
            }

            DateTime temp = startTime;
            while (temp < endTime || temp.EqualsUpToDay(endTime))
            {
                var dateFilterData = ordersResult.Items.Where(n => n.CompletedTime.HasValue && temp.EqualsUpToDay(n.CompletedTime.Value));
                result.RevenuePerDay.Add(new ChartDataViewModel()
                {
                    Key = temp.Day.ToString() + '/' + temp.Month.ToString(),
                    Value = dateFilterData.Sum(n => n.Total)
                });

                temp = temp.AddDays(1);
            }

            return result;
        }
    }
}
