using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Material.ViewModels;
using WarehouseApi.Common.Paging;

namespace WarehouseApi.Business.Material.Queries.GetListMaterial
{
    public interface IGetListMaterialQuery
    {
        Task<PagedList<MaterialViewModel>> ExecuteAsync(int page, int pageSize, string searchString);
    }
}