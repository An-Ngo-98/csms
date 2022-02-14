using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Warehouse.Queries.GetImportExportHistories
{
    public class GetImportExportHistoriesQuery : IGetImportExportHistoriesQuery
    {
        private readonly IRepository<CsmsImportHistory> _importRepository;
        private readonly IRepository<CsmsExportHistory> _exportRepository;

        public GetImportExportHistoriesQuery(
            IRepository<CsmsImportHistory> importRepository,
            IRepository<CsmsExportHistory> exportRepository)
        {
            _importRepository = importRepository;
            _exportRepository = exportRepository;
        }

        public async Task<List<ImportExportHistoryViewModel>> ExecuteAsync(int? materialId)
        {
            var importHistories = await _importRepository.TableNoTracking
                .Where(n => materialId.HasValue ? n.MaterialId == materialId.Value : true)
                .Select(n => new ImportExportHistoryViewModel()
                {
                    MaterialId = n.MaterialId,
                    MaterialName = n.Material.Name,
                    Unit = n.Material.Unit,
                    IsImport = true,
                    PartnerId = n.PartnerId,
                    PartnerName = n.Partner.Name,
                    Quantity = n.QuantityUnit,
                    Time = n.ImportDate
                })
                .ToListAsync();

            var exportHistories = await _exportRepository.TableNoTracking
                .Where(n => materialId.HasValue ? n.MaterialId == materialId.Value : true)
                .Select(n => new ImportExportHistoryViewModel()
                {
                    MaterialId = n.MaterialId,
                    MaterialName = n.Material.Name,
                    Unit = n.Material.Unit,
                    Quantity = n.QuantityUnit,
                    Time = n.ExportDate,
                    BranchId = n.BranchId,
                    BranchName = n.BranchName
                })
                .ToListAsync();

            importHistories.AddRange(exportHistories);

            return importHistories.OrderByDescending(n => n.Time).ToList();
        }
    }
}
