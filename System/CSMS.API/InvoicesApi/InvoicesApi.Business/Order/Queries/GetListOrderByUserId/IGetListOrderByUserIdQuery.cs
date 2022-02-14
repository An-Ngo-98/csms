using InvoicesApi.Business.Order.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.GetListOrderByUserId
{
    public interface IGetListOrderByUserIdQuery
    {
        Task<List<OrderByUserIdViewModel>> ExecuteAsync(int userId);
    }
}
