using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Warehouse.Queries.GetWarehouseMaterial
{
    public class GetWarehouseMaterialQuery : IGetWarehouseMaterialQuery
    {
        private readonly IRepository<CsmsMaterial> _materialRepository;

        public GetWarehouseMaterialQuery(IRepository<CsmsMaterial> materialRepository)
        {
            _materialRepository = materialRepository;
        }

        public async Task<List<WarehouseMaterialViewModel>> ExecuteAsync()
        {
            var result = await _materialRepository.TableNoTracking
                .Select(n => new WarehouseMaterialViewModel()
                {
                    MaterialId = n.Id,
                    MaterialName = n.Name,
                    Unit = n.Unit,
                    DefaultPartnerId = n.DefaultPartnerId,
                    DefaultQuantity = n.DefaultQuantity,
                    partners = n.PartnerMaterials.Select(p => new WarehousePartnerViewModel()
                    {
                        PartnerId = p.PartnerId,
                        PartnerName = p.Partner.Name,
                        MaterialPrice = p.Price
                    }).ToList(),
                    TotalImportQuantity = n.ImportHistories.Sum(x => x.QuantityUnit),
                    TotalExportQuantity = n.ExportHistories.Sum(e => e.QuantityUnit)
                })
                .ToListAsync();

            return result;
        }
    }
}
