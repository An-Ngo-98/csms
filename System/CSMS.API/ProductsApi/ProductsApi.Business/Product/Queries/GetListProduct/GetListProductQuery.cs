using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Common.Paging;
using ProductsApi.Data.Entities;
using ProductsApi.Data.Services;

namespace ProductsApi.Business.Product.Queries.GetListProduct
{
    public class GetListProductQuery : IGetListProductQuery
    {
        private readonly IRepository<CsmsProduct> _productRepository;

        public GetListProductQuery(IRepository<CsmsProduct> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<PagedList<ProductViewModel>> ExecuteAsync(int page, int pageSize, int sortField, int? categoryId, bool? Enabled, string searchString)
        {
            try
            {
                var data = await GetDataAsync(categoryId, Enabled, searchString);
                data = SortData(data, sortField);

                var result = page == 0 && pageSize == 0 ? data : data.Skip((page - 1) * pageSize).Take(pageSize);
                List<ProductViewModel> list = new List<ProductViewModel>();

                int total = 0;
                total = data.Count();
                list = result.ToList();

                return new PagedList<ProductViewModel>(list, page, pageSize, total);
            }
            catch (Exception)
            {
                //Logging<GetListEmployeeQuery>.Error(ex, "Data: " + JsonConvert.SerializeObject(page + pageSize + sortField + sortType + departmentCode + status + searchBy + startDate + endDate + searchString));
                return new PagedList<ProductViewModel>(new List<ProductViewModel>(), 1, 1, 0);
            }
        }

        private async Task<IEnumerable<ProductViewModel>> GetDataAsync(int? categoryId, bool? Enabled, string searchString)
        {
            var result = await _productRepository.TableNoTracking
                .Where(n => n.Deleted == false &&
                (Enabled.HasValue ? n.Enabled == Enabled : true) &&
                (categoryId == (int)CategorySelect.All ? true :
                    (n.CategoryId == categoryId) ||
                    ((n.Category != null && (n.Category.Enabled == false || n.Category.Deleted == true) && categoryId == null))))
                .Select(n => new ProductViewModel()
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
                }).ToListAsync();

            return SearchString(result, searchString);
        }

        private IEnumerable<ProductViewModel> SearchString(IEnumerable<ProductViewModel> data, string searchString)
        {
            List<ProductViewModel> result = data.ToList();

            if (!string.IsNullOrEmpty(searchString))
            {
                result = new List<ProductViewModel>();
                char[] delimiter = { ',', ';' };
                string[] listSearch = searchString.ToLower().Split(delimiter);

                foreach (var item in listSearch)
                {
                    var value = item.ToLower().Trim();

                    var temp = data.Where(x => (x.Name.ToLower().Replace("  ", " ").Contains(value))
                       || (x.Code != null && x.Code.ToLower().Contains(value))
                       || (x.CategoryName != null && x.CategoryName.ToLower().Replace("  ", " ").Contains(value))
                       || (x.Description != null && x.Description.ToLower().Contains(value)));

                    result.AddRange(temp.ToList());
                }
            }

            return result.Distinct() as IEnumerable<ProductViewModel>;
        }

        private IEnumerable<ProductViewModel> SortData(IEnumerable<ProductViewModel> data, int sortField)
        {
            switch (sortField)
            {
                case (int)SortField.ProductStatus:
                    return data.OrderBy(x => x.Enabled);

                case (int)SortField.HighestRate:
                    return data.OrderByDescending(x => x.Rate);

                case (int)SortField.LowestRate:
                    return data.OrderBy(x => x.Rate);

                case (int)SortField.HighestPrice:
                    return data.OrderByDescending(x => int.Parse(x.Price));

                case (int)SortField.LowestPrice:
                    return data.OrderBy(x => int.Parse(x.Price));

                case (int)SortField.HighestVotes:
                    return data.OrderByDescending(x => x.TotalVote);

                case (int)SortField.LowestVotes:
                    return data.OrderBy(x => x.TotalVote);

                default:
                    return data.OrderBy(x => x.Name);
            }
        }
    }

    enum SortField
    {
        ProductName = 1,
        ProductStatus = 2,
        HighestRate = 3,
        LowestRate = 4,
        HighestPrice = 5,
        LowestPrice = 6,
        HighestVotes = 7,
        LowestVotes = 8
    }

    enum CategorySelect
    {
        All = 0,
        HasValue = 1
    }
}
