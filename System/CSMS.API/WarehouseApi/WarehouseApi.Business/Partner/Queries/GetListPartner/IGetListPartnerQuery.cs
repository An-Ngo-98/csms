using System.Threading.Tasks;
using WarehouseApi.Business.Partner.ViewModels;
using WarehouseApi.Common.Paging;

namespace WarehouseApi.Business.Partner.Queries.GetListPartner
{
    public interface IGetListPartnerQuery
    {
        Task<PagedList<PartnerViewModel>> ExecuteAsync(int page, int pageSize, string searchString);
    }
}