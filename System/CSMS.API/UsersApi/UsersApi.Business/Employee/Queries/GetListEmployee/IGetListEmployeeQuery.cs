using System.Threading.Tasks;
using UsersApi.Business.Employee.ViewModels;
using UsersApi.Common.Paging;

namespace UsersApi.Business.Employee.Queries.GetListEmployee
{
    public interface IGetListEmployeeQuery
    {
        Task<PagedList<ListEmployeeViewModel>> ExecuteAsync(int page, int pageSize, int sortField, int sortType, int? branchId, int? employeeStatus, int? searchBy, string startDate, string endDate, string searchString);
    }
}