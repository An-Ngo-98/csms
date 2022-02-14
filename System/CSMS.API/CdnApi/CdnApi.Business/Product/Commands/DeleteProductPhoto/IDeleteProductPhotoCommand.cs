using CdnApi.CrossCutting.Command;
using System.Threading.Tasks;

namespace CdnApi.Business.Product.Commands.DeleteProductPhoto
{
    public interface IDeleteProductPhotoCommand
    {
        Task<CommandResult> ExecuteAsync(int imageId);
    }
}