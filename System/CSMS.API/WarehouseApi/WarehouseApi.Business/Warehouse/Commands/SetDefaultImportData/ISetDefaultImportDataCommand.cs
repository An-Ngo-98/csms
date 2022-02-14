using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Business.Warehouse.Commands.SetDefaultImportData
{
    public interface ISetDefaultImportDataCommand
    {
        Task<CommandResult> ExecuteAsync(List<ImportMaterialViewModel> listMaterial);
    }
}