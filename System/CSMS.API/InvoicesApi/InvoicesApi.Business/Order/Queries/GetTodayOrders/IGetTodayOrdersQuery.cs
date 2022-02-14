using InvoicesApi.Business.Order.ViewModels;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.GetTodayOrders
{
    public interface IGetTodayOrdersQuery
    {
        Task<TodayOrderViewModel> ExecuteAsync(int orderStatus, string storeIds);
    }
}