using InvoicesApi.Business.Report.ViewModels;
using System;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Report.Queries.GetRevenueOverview
{
    public interface IGetRevenueOverviewQuery
    {
        Task<RevenueOverviewViewModel> ExecuteAsync(DateTime startTime, DateTime endTime);
    }
}