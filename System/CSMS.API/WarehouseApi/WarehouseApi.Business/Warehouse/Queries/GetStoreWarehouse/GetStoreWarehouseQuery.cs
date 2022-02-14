using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Warehouse.Queries.GetStoreWarehouse
{
    public class GetStoreWarehouseQuery : IGetStoreWarehouseQuery
    {
        private readonly IRepository<CsmsExportHistory> _exportHistoryRepository;
        private readonly IRepository<CsmsMaterial> _materialRepository;

        public GetStoreWarehouseQuery(
            IRepository<CsmsExportHistory> exportHistoryRepository,
            IRepository<CsmsMaterial> materialRepository)
        {
            _exportHistoryRepository = exportHistoryRepository;
            _materialRepository = materialRepository;
        }

        public async Task<List<StoreMaterialViewModel>> ExecuteAsync(int branchId)
        {
            var result = await _materialRepository.TableNoTracking
                .Where(n => n.ExportHistories.Where(x => x.BranchId == branchId).Count() > 0)
                .Select(n => new StoreMaterialViewModel()
                {
                    BranchId = branchId,
                    BranchName = n.ExportHistories.First().BranchName,
                    Unit = n.Unit,
                    MaterialId = n.Id,
                    MaterialName = n.Name,
                    TotalImport = n.ExportHistories.Where(x => x.BranchId == branchId).Sum(x => x.QuantityUnit),
                    TotalUsed = n.StoreUsedLogs.Where(x => x.BranchId == branchId).Sum(x => x.Amount)
                })
                .Distinct()
                .ToListAsync();

            foreach (var item in result)
            {
                item.Amount = item.TotalImport - item.TotalUsed;
            }

            return result;
        }
    }
}
