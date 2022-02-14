using InvoicesApi.Data.Entities;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.GetOrderById
{
    public interface IGetOrderByIdQuery
    {
        Task<CsmsOrder> ExecuteAsync(string orderId);
    }
}