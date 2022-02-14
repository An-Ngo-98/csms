using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CdnApi.Business.Product.Commands.UploadProductPhoto
{
    public interface IUploadProductPhotoCommand
    {
        Task<CommandResult> ExecuteAsync(int imageId, IFormFile file);
    }
}