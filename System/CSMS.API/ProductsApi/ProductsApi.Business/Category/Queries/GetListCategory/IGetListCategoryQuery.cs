using ProductsApi.Business.Category.ViewModels;
using ProductsApi.Common.Paging;
using System.Threading.Tasks;

namespace ProductsApi.Business.Category.Queries.GetListCategory
{
    public interface IGetListCategoryQuery
    {
        Task<PagedList<CategoryViewModel>> ExecuteAsync(int page, int pageSize);
    }
}