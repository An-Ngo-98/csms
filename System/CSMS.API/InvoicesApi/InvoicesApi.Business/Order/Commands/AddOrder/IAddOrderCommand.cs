using InvoicesApi.Common.Commands;
using InvoicesApi.Data.Entities;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Order.Commands.AddOrder
{
    public interface IAddOrderCommand
    {
        Task<CommandResult> ExecuteAsync(CsmsOrder model);
    }
}