using System.Threading.Tasks;

namespace UsersApi.Business.Employee.Queries.ExportListEmployee
{
    public interface IExportListEmployeeQuery
    {
        Task<byte[]> ExecuteAsync(int exportType = 0, string listEmployeeId = "", string search = "");
    }
}