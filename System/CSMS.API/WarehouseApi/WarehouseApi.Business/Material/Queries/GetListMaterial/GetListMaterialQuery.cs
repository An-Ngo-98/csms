using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WarehouseApi.Business.Material.ViewModels;
using WarehouseApi.Common.Extentions;
using WarehouseApi.Common.Paging;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Material.Queries.GetListMaterial
{
    public class GetListMaterialQuery : IGetListMaterialQuery
    {
        private readonly IRepository<CsmsMaterial> _materialRepository;

        public GetListMaterialQuery(IRepository<CsmsMaterial> materialRepository)
        {
            _materialRepository = materialRepository;
        }

        public async Task<PagedList<MaterialViewModel>> ExecuteAsync(int page, int pageSize, string searchString)
        {
            var data = await _materialRepository.TableNoTracking
                .Where(n => searchString.IsEmpty() ? true : n.Name.ToLower().Replace("  ", " ").Contains(searchString.ToLower()))
                .Select(n => new MaterialViewModel()
                {
                    Id = n.Id,
                    Name = n.Name,
                    Amount = n.Amount,
                    Unit = n.Unit,
                    Partners = n.PartnerMaterials.Select(x => x.Partner.Name).ToList()
                })
                .ToListAsync();

            var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
            int total = data.Count();
            var list = result.ToList();

            return new PagedList<MaterialViewModel>(list, page, pageSize, total);
        }
    }
}
