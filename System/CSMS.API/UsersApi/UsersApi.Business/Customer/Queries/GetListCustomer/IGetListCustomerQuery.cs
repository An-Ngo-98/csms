using System.Threading.Tasks;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Common.Paging;

namespace UsersApi.Business.Customer.Queries.GetListCustomer
{
    public interface IGetListCustomerQuery
    {
        Task<PagedList<ListCustomerViewModel>> ExecuteAsync(int page, int pageSize, int sortField, int sortType, int? customerStatus, string searchString);
    }
}