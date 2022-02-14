using System;
using System.Threading.Tasks;

namespace InvoicesApi.Business.User.Queries.GetNumOfNewCustomers
{
    public interface IGetNumOfNewCustomersQuery
    {
        Task<int> ExecuteAsync(DateTime startDate, DateTime endDate);
    }
}