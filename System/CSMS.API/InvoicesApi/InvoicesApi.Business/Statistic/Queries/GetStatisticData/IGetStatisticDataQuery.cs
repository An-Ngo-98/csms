using InvoicesApi.Business.Statistic.ViewModels;
using System;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Statistic.Queries.GetStatisticData
{
    public interface IGetStatisticDataQuery
    {
        Task<StatisticViewModel> ExecuteAsync(DateTime startDate, DateTime endDate);
    }
}