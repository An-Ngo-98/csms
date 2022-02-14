using ProductsApi.Common.Commands;
using ProductsApi.Data.Entities;
using System.Threading.Tasks;

namespace ProductsApi.Business.Category.Commands.SaveCategory
{
    public interface ISaveCategoryCommand
    {
        Task<CommandResult> ExecuteAsync(CsmsCategory category);
    }
}