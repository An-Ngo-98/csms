using System.Threading.Tasks;
using WarehouseApi.Business.Bill.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Business.Bill.Commands.PayBill
{
    public interface IPayBillCommand
    {
        Task<CommandResult> ExecuteAsync(BillViewModel bill);
    }
}