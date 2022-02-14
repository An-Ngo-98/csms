using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Queries.ExportListInvoice
{
    public interface IExportListInvoiceQuery
    {
        Task<byte[]> ExecuteAsync(int exportType = 0, string listInvoiceIds = "", string searchCondition = "");
    }
}