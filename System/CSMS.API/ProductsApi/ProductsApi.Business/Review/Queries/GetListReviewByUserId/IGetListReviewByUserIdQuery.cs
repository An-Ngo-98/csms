using ProductsApi.Business.Review.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductsApi.Business.Review.Queries.GetListReviewByUserId
{
    public interface IGetListReviewByUserIdQuery
    {
        Task<List<ReviewByUserIdViewModel>> ExecuteAsync(int userId, string orderId = null);
    }
}