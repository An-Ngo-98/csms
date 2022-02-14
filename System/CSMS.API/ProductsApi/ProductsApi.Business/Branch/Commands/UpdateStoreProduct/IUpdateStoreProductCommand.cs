using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Common.Commands;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductsApi.Business.Branch.Commands.UpdateStoreProduct
{
    public interface IUpdateStoreProductCommand
    {
        public Task<CommandResult> ExecuteAsync(int branchId, List<EnableProductViewModel> listProduct);
    }
}