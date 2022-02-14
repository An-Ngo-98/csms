using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;

namespace WarehouseApi.Business.Warehouse.Queries.GetStoreWarehouse
{
    public interface IGetStoreWarehouseQuery
    {
        Task<List<StoreMaterialViewModel>> ExecuteAsync(int branchId);
    }
}