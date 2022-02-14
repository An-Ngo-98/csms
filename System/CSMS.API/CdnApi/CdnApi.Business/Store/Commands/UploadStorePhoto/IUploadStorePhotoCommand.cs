using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CdnApi.Business.Store.Commands.UploadStorePhoto
{
    public interface IUploadStorePhotoCommand
    {
        Task<CommandResult> ExecuteAsync(int storeId, IFormFile file);
    }
}