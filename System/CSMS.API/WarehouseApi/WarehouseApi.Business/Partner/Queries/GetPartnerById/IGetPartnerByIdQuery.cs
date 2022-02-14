using System.Threading.Tasks;
using WarehouseApi.Business.Partner.ViewModels;

namespace WarehouseApi.Business.Partner.Queries.GetPartnerById
{
    public interface IGetPartnerByIdQuery
    {
        Task<PartnerViewModel> ExecuteAsync(int partnerId);
    }
}