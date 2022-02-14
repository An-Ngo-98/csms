using InvoicesApi.Business.Report.ViewModels;
using System;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Report.Queries.GetRevenueByCategory
{
    public interface IGetRevenueByCategoryQuery
    {
        Task<RevenueByCategoryViewModel> ExecuteAsync(DateTime startDate, DateTime endDate);
    }
}