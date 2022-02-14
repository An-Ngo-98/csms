using ProductsApi.Business.Product.ViewModels;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Queries.GetProductById
{
    public interface IGetProductByIdQuery
    {
        Task<ProductViewModel> ExecuteAsync(int productId);
    }
}