using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using WarehouseApi.Business.Partner.ViewModels;
using WarehouseApi.Data.Entities;
using WarehouseApi.Data.Services;

namespace WarehouseApi.Business.Partner.Queries.GetPartnerById
{
    public class GetPartnerByIdQuery : IGetPartnerByIdQuery
    {
        private readonly IRepository<CsmsPartner> _partnerRepository;

        public GetPartnerByIdQuery(IRepository<CsmsPartner> partnerRepository)
        {
            _partnerRepository = partnerRepository;
        }

        public async Task<PartnerViewModel> ExecuteAsync(int partnerId)
        {
            var partner = await _partnerRepository.TableNoTracking
                .Where(n => n.Id == partnerId)
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
                .SingleOrDefaultAsync();

            return partner;
        }
    }
}
