using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Bill.ViewModels;

namespace WarehouseApi.Business.Bill.Queries.GetListBill
{
    public interface IGetListBillQuery
    {
        Task<List<BillViewModel>> ExecuteAsync(int month, int year);
    }
}