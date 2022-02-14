using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Business.Warehouse.Commands.ImportMaterial
{
    public interface IImportMaterialCommand
    {
        Task<CommandResult> ExecuteAsync(List<ImportMaterialViewModel> listMaterial);
    }
}