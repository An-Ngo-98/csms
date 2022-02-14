using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;

namespace WarehouseApi.Business.Warehouse.Queries.GetImportExportHistories
{
    public interface IGetImportExportHistoriesQuery
    {
        Task<List<ImportExportHistoryViewModel>> ExecuteAsync(int? materialId);
    }
}