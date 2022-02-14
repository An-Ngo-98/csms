using System.Threading.Tasks;

namespace UsersApi.Business.Customer.Queries.ExportListCustomer
{
    public interface IExportListCustomerQuery
    {
        Task<byte[]> ExecuteAsync(int exportType = 0, string listCustomerId = "", string search = "");
    }
}