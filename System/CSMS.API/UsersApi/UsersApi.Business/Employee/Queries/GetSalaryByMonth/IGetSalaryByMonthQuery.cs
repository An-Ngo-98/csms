using System.Collections.Generic;
using System.Threading.Tasks;
using UsersApi.Business.Employee.ViewModels;

namespace UsersApi.Business.Employee.Queries.GetSalaryByMonth
{
    public interface IGetSalaryByMonthQuery
    {
        Task<List<EmployeeSalaryViewModel>> ExecuteAsync(int? branchId, int month, int year);
    }
}