using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Queries.GetEnableProduct
{
    public class GetEnableProductQuery : IGetEnableProductQuery
    {
        private readonly IRepository<CsmsProduct> _productRepository;

        public GetEnableProductQuery(IRepository<CsmsProduct> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<EnableProductViewModel>> ExecuteAsync()
        {
            var result = await _productRepository.TableNoTracking
                .Where(n => n.Deleted == false && n.Enabled == true)
                .Select(n => new EnableProductViewModel()
                {
                    Id = n.Id,
                    CategoryId = n.Category != null && n.Category.Enabled == true ? n.CategoryId : null,
                    CategoryName = n.Category != null && n.Category.Enabled == true ? n.Category.Name : null,
                    Code = n.Code,
                    Name = n.Name,
                    AvatarId = n.AvatarId,
                    Price = n.Price,
                    ShortDescription = n.ShortDescription,
                    Description = n.Description,
                    Rate = n.Rate,
                    TotalRate = n.Votes.Count,
                    Photos = n.Photos.Select(x => x.PhotoId).ToList(),
                    TotalRateDetail = new List<int> {
                        n.Votes.Where(x => x.Score == 1).ToList().Count,
                        n.Votes.Where(x => x.Score == 2).ToList().Count,
                        n.Votes.Where(x => x.Score == 3).ToList().Count,
                        n.Votes.Where(x => x.Score == 4).ToList().Count,
                        n.Votes.Where(x => x.Score == 5).ToList().Count,
                    },
                    AvailableBranchs = n.BranchProducts.Select(x => x.BranchId).ToList(),
                    SearchString = n.SearchString,
                    Enabled = n.Enabled,
                })
                .ToListAsync();

            return result;
        }
    }
}
