using ProductsApi.Common.Commands;
using System.Threading.Tasks;

namespace ProductsApi.Business.Product.Commands.DeleteProduct
{
    public interface IDeleteProductCommand
    {
        Task<CommandResult> ExecuteAsync(int productId);
    }
}