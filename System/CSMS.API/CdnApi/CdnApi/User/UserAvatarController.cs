using System.Threading.Tasks;
using CdnApi.Business.User.Commands.UploadUserAvatarCommand;
using CdnApi.Business.User.Queries.GetUserAvatar;
using CdnApi.Common.Extensions;
using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CdnApi.User
{
    [Route("api/users/avatar")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IGetUserAvatarQuery _getUserAvatarQuery;
        private readonly IUploadUserAvatarCommand _uploadUserAvatarCommand;

        public UsersController(
            IGetUserAvatarQuery getUserAvatarQuery,
            IUploadUserAvatarCommand uploadUserAvatarCommand)
        {
            _getUserAvatarQuery = getUserAvatarQuery;
            _uploadUserAvatarCommand = uploadUserAvatarCommand;
        }

        [AllowAnonymous]
        [HttpGet("save-cache/{userId}/{size:int=600}")]
        [ResponseCache(Duration = 60 * 60 * 8, VaryByQueryKeys = new[] { "userId", "size" })]
        public async Task<IActionResult> GetUserAvatarSaveCacheAsync(int userId, int size)
        {
            var photo = await _getUserAvatarQuery.ExecuteAndSaveCacheAsync(userId);
            if (photo == null)
            {
                return NotFound();
            }
            byte[] resized = ImageProcessing.CreateThumbnail(photo.Content, size);
            return new FileContentResult(resized, photo.FileType);
        }

        [AllowAnonymous]
        [HttpGet("{userId}/{size:int=600}")]
        public async Task<IActionResult> GetUserAvatarAsync(int userId, int size)
        {
            var photo = await _getUserAvatarQuery.ExecuteAsync(userId);
            if (photo == null)
            {
                return BadRequest();
            }
            byte[] resized = ImageProcessing.CreateThumbnail(photo.Content, size);
            return new FileContentResult(resized, photo.FileType);
        }

        [AllowAnonymous]
        [HttpPost("{userId:int=0}")]
        public async Task<IActionResult> SaveUserAvatarAsync(IFormFile file, int userId)
        {
            var result = await _uploadUserAvatarCommand.ExecuteAsync(file, userId);
            return new ObjectResult(result);
        }
    }
}