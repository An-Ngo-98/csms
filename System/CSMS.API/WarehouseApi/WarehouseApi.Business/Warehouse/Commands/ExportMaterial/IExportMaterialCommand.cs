using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Business.Warehouse.Commands.ExportMaterial
{
    public interface IExportMaterialCommand
    {
        Task<CommandResult> ExecuteAsync(List<ExportMaterialViewModel> listMaterial);
    }
}