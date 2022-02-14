using System.Threading.Tasks;
using CdnApi.Business.Store.Commands.UploadStorePhoto;
using CdnApi.Business.Store.Queries.GetStorePhoto;
using CdnApi.Common.Extensions;
using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CdnApi.Store
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoresController : ControllerBase
    {
        private readonly IGetStorePhotoQuery _getStorePhotoQuery;
        private readonly IUploadStorePhotoCommand _uploadStorePhotoCommand;

        public StoresController(
            IGetStorePhotoQuery getStorePhotoQuery,
            IUploadStorePhotoCommand uploadStorePhotoCommand)
        {
            _getStorePhotoQuery = getStorePhotoQuery;
            _uploadStorePhotoCommand = uploadStorePhotoCommand;
        }

        [AllowAnonymous]
        [HttpGet("{storeId:int=0}")]
        public async Task<IActionResult> GetStorePhotoAsync(int storeId, int size = 600)
        {
            var photo = await _getStorePhotoQuery.ExecuteAsync(storeId);
            if (photo == null)
            {
                return BadRequest();
            }
            byte[] resized = ImageProcessing.CreateThumbnail(photo.Photo, size);
            return new FileContentResult(resized, photo.PhotoType);
        }

        [AllowAnonymous]
        [HttpPost("{storeId:int=0}")]
        public async Task<IActionResult> UploadStorePhotoAsync(int storeId, IFormFile file)
        {
            var result = await _uploadStorePhotoCommand.ExecuteAsync(storeId, file);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}