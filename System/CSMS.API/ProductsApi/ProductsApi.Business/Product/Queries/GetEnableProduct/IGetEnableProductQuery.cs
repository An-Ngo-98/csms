using ProductsApi.Business.Product.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Queries.GetEnableProduct
{
    public interface IGetEnableProductQuery
    {
        Task<List<EnableProductViewModel>> ExecuteAsync();
    }
}