using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CdnApi.Business.Category.Commands.UploadCategoryPhoto
{
    public interface IUploadCategoryPhotoCommand
    {
        Task<CommandResult> ExecuteAsync(int categoryId, IFormFile file);
    }
}