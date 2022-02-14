using InvoicesApi.Business.Report.ViewModels;
using System;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Report.Queries.GetRevenueByStore
{
    public interface IGetRevenueByStoreQuery
    {
        Task<RevenueByStoreViewModel> ExecuteAsync(DateTime startDate, DateTime endDate);
    }
}