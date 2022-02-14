using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System.Linq;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Queries.GetProductById
{
    public class GetProductByIdQuery : IGetProductByIdQuery
    {
        private readonly IRepository<CsmsProduct> _productRepository;

        public GetProductByIdQuery(IRepository<CsmsProduct> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<ProductViewModel> ExecuteAsync(int productId)
        {
            var data = _productRepository.TableNoTracking
                .Where(n => n.Deleted == false && n.Id == productId)
                .Include(n => n.Category)
                .Include(n => n.Votes)
                .Include(n => n.Photos);

            var result = await data.Select(n => new ProductViewModel()
            {
                Id = n.Id,
                CategoryId = n.Category != null && n.Category.Enabled == true ? n.CategoryId : null,
                CategoryName = n.Category != null && n.Category.Enabled == true ? n.Category.Name : null,
                Code = n.Code,
                Name = n.Name,
                AvatarId = n.AvatarId,
                ShortDescription = n.ShortDescription,
                Description = n.Description,
                Price = n.Price,
                Rate = n.Rate,
                SearchString = n.SearchString,
                TotalVote = n.Votes.Count,
                Enabled = n.Enabled,
                Photos = n.Photos.Select(p => new PhotoViewModel()
                {
                    Id = p.Id,
                    PhotoId = p.PhotoId
                }).ToList()
            }).SingleOrDefaultAsync();

            return result;
        }
    }
}
