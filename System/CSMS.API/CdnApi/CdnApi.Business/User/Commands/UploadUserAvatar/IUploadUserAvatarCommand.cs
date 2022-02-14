using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CdnApi.Business.User.Commands.UploadUserAvatarCommand
{
    public interface IUploadUserAvatarCommand
    {
        Task<CommandResult> ExecuteAsync(IFormFile file, int userId);
    }
}