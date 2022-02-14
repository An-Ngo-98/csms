using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Common.Commands;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Commands.SaveProduct
{
    public interface ISaveProductCommand
    {
        Task<CommandResult> ExecuteAsync(ProductViewModel model);
    }
}