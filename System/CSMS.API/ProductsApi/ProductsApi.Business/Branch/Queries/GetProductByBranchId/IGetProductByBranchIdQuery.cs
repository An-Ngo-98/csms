using ProductsApi.Business.Product.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductsApi.Business.Branch.Queries.GetProductByBranchId
{
    public interface IGetProductByBranchIdQuery
    {
        Task<List<EnableProductViewModel>> ExecuteAsync(int branchId);
    }
}