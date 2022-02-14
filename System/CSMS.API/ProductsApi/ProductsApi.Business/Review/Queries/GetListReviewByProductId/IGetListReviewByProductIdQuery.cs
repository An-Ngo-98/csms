using ProductsApi.Business.Review.ViewModels;
using ProductsApi.Common.Paging;
using System.Threading.Tasks;

namespace ProductsApi.Business.Review.Queries.GetListReviewByProductId
{
    public interface IGetListReviewByProductIdQuery
    {
        Task<PagedList<ReviewViewModel>> ExecuteAsync(int productId, int page, int pageSize, int filterType);
    }
}