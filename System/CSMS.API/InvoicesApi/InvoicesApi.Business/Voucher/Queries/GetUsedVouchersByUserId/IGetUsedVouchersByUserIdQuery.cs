using InvoicesApi.Business.Voucher.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Voucher.Queries.GetUsedVouchersByUserId
{
    public interface IGetUsedVouchersByUserIdQuery
    {
        Task<List<UsedVoucherViewModel>> ExecuteAsync(int userId);
    }
}