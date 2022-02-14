using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductsApi.Business.Branch.Queries.GetProductByBranchId
{
    public class GetProductByBranchIdQuery : IGetProductByBranchIdQuery
    {
        private readonly IRepository<CsmsProduct> _productRepository;

        public GetProductByBranchIdQuery(IRepository<CsmsProduct> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<EnableProductViewModel>> ExecuteAsync(int branchId)
        {
            var data = await _productRepository.TableNoTracking
                .Where(n =>
                n.BranchProducts.Any(n => n.BranchId == branchId) &&
                n.Deleted == false &&
                n.Enabled == true)
                .Include(n => n.Category)
                .Include(n => n.Votes)
                .Include(n => n.Photos)
                .ToListAsync();

            var result = data.Select(n => new EnableProductViewModel()
            {
                Id = n.Id,
                CategoryId = n.Category != null && n.Category.Enabled == true ? n.CategoryId : null,
                CategoryName = n.Category != null && n.Category.Enabled == true ? n.Category.Name : null,
                Code = n.Code,
                Name = n.Name,
                AvatarId = n.AvatarId,
                Enabled = n.Enabled,
                Description = n.Description,
                ShortDescription = n.ShortDescription,
            }).ToList();

            return result;
        }
    }
}
