using ProductsApi.Business.Category.ViewModels;
using ProductsApi.Common.Commands;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductsApi.Business.Category.Queries.GetEnableCategory
{
    public interface IGetEnableCategoryQuery
    {
        Task<List<EnabledCategoryViewModel>> ExecuteAsync();
    }
}