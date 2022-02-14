using InvoicesApi.Common.Commands;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Commands.UpdateStatusOrder
{
    public interface IUpdateStatusOrderCommand
    {
        Task<CommandResult> ExecuteAsync(string orderId, int statusCode);
    }
}