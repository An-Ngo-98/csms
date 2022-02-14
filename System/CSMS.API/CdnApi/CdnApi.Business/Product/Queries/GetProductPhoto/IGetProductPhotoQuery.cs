using CdnApi.Business.Product.ViewModels;
using System.Threading.Tasks;

namespace CdnApi.Business.Product.Queries.GetProductPhoto
{
    public interface IGetProductPhotoQuery
    {
        Task<ProductPhotoViewModel> ExecuteAsync(int imageId);
    }
}