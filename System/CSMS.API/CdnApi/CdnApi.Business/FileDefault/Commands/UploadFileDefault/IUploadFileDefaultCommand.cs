using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CdnApi.Business.FileDefault.Commands.UploadFileDefault
{
    public interface IUploadFileDefaultCommand
    {
        Task<CommandResult> ExecuteAsync(string defaultFileType, string title, IFormFile file);
    }
}