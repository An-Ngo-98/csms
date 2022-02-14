using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Common.Paging;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Queries.GetListProduct
{
    public interface IGetListProductQuery
    {
        Task<PagedList<ProductViewModel>> ExecuteAsync(int page, int pageSize, int sortField, int? categoryId, bool? Enabled, string searchString);
    }
}