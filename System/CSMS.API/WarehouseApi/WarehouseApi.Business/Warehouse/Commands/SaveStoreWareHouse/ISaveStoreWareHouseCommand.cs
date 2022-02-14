using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Business.Warehouse.Commands.SaveStoreWareHouse
{
    public interface ISaveStoreWareHouseCommand
    {
        Task<CommandResult> ExecuteAsync(List<StoreMaterialViewModel> listMaterial);
    }
}