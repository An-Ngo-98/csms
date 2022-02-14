using ProductsApi.Common.Commands;
using System.Threading.Tasks;

namespace ProductsApi.Business.Category.Commands.DeleteCategory
{
    public interface IDeleteCategoryCommand
    {
        Task<CommandResult> ExecuteAsync(int catId);
    }
}