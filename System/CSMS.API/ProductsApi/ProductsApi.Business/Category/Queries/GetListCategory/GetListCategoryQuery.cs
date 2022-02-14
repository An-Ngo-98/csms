using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Category.ViewModels;
using ProductsApi.Common.Paging;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductsApi.Business.Category.Queries.GetListCategory
{
    public class GetListCategoryQuery : IGetListCategoryQuery
    {
        private readonly IRepository<CsmsCategory> _categoryRepository;

        public GetListCategoryQuery(IRepository<CsmsCategory> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public IRepository<CsmsCategory> CategoryRepository => _categoryRepository;

        public async Task<PagedList<CategoryViewModel>> ExecuteAsync(int page, int pageSize)
        {
            try
            {
                var data = await _categoryRepository.TableNoTracking
                    .Where(n => n.Deleted == false)
                    .Select(n => new CategoryViewModel()
                    {
                        Id = n.Id,
                        Name = n.Name,
                        Products = n.Products.Select(n => n.Name).ToArray(),
                        Enabled = n.Enabled
                    })
                    .ToListAsync();

                var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
                List<CategoryViewModel> list = new List<CategoryViewModel>();

                int total = 0;
                total = data.Count();
                list = result.ToList();

                return new PagedList<CategoryViewModel>(list, page, pageSize, total);
            }
            catch (Exception)
            {
                return new PagedList<CategoryViewModel>(new List<CategoryViewModel>(), 1, 1, 0);
            }
        }
    }
}
