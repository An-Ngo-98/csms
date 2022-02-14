using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using WarehouseApi.Business.Partner.ViewModels;
using WarehouseApi.Common.Extentions;
using WarehouseApi.Common.Paging;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Partner.Queries.GetListPartner
{
    public class GetListPartnerQuery : IGetListPartnerQuery
    {
        private readonly IRepository<CsmsPartner> _partnerRepository;

        public GetListPartnerQuery(IRepository<CsmsPartner> partnerRepository)
        {
            _partnerRepository = partnerRepository;
        }

        public async Task<PagedList<PartnerViewModel>> ExecuteAsync(int page, int pageSize, string searchString)
        {
            var data = await _partnerRepository.TableNoTracking
                .Where(n => searchString.IsEmpty() ? true : n.Name.ToLower().Replace("  ", " ").Contains(searchString.ToLower()))
                .Select(n => new PartnerViewModel()
                {
                    Id = n.Id,
                    Name = n.Name,
                    PhoneNumber = n.PhoneNumber,
                    Address = n.Address,
                    Materials = n.PartnerMaterials.Select(x => new PartnerMaterialViewModel()
                    {
                        Id = x.Id,
                        MaterialId = x.Material.Id,
                        Name = x.Material.Name,
                        Amount = x.Material.Amount,
                        Unit = x.Material.Unit,
                        MaxUnit = x.MaxUnit,
                        Price = x.Price
                    }).ToList()
                })
                .ToListAsync();

            var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
            int total = data.Count();
            var list = result.ToList();

            return new PagedList<PartnerViewModel>(list, page, pageSize, total);
        }
    }
}
