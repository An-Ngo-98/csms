using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Category.ViewModels;
using ProductsApi.Common.Commands;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductsApi.Business.Category.Queries.GetEnableCategory
{
    public class GetEnableCategoryQuery : IGetEnableCategoryQuery
    {
        private readonly IRepository<CsmsCategory> _categoryRepository;

        public GetEnableCategoryQuery(IRepository<CsmsCategory> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<EnabledCategoryViewModel>> ExecuteAsync()
        {
            var result = await _categoryRepository.TableNoTracking
                .Where(n => n.Deleted == false && n.Enabled == true)
                .Select(n => new EnabledCategoryViewModel()
                {
                    Id = n.Id,
                    Name = n.Name
                })
                .ToListAsync();

            return result;
        }
    }
}
