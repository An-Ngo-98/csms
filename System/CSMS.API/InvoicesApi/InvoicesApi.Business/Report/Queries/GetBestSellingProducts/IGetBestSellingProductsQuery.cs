using InvoicesApi.Business.Report.ViewModels;
using System;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Report.Queries.GetBestSellingProducts
{
    public interface IGetBestSellingProductsQuery
    {
        Task<BestSellingProductsViewModel> ExecuteAsync(DateTime startDate, DateTime endDate);
    }
}