using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CdnApi.Business.Category.Commands.UploadCategoryPhoto;
using CdnApi.Business.Category.Queries.GetCategoryPhoto;
using CdnApi.Common.Extensions;
using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CdnApi.Category
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IGetCategoryPhotoQuery _getCategoryPhotoQuery;
        private readonly IUploadCategoryPhotoCommand _uploadCategoryPhotoCommand;

        public CategoriesController(
            IGetCategoryPhotoQuery getCategoryPhotoQuery,
            IUploadCategoryPhotoCommand uploadCategoryPhotoCommand)
        {
            _getCategoryPhotoQuery = getCategoryPhotoQuery;
            _uploadCategoryPhotoCommand = uploadCategoryPhotoCommand;
        }

        [AllowAnonymous]
        [HttpGet("{categoryId:int=0}")]
        public async Task<IActionResult> GetCategoryPhotoAsync(int categoryId, int size = 600)
        {
            var photo = await _getCategoryPhotoQuery.ExecuteAsync(categoryId);
            if (photo == null)
            {
                return BadRequest();
            }
            byte[] resized = ImageProcessing.CreateThumbnail(photo.Photo, size);
            return new FileContentResult(resized, photo.PhotoType);
        }

        [AllowAnonymous]
        [HttpPost("{categoryId:int=0}")]
        public async Task<IActionResult> UploadCategoryPhotoAsync(int categoryId, IFormFile file)
        {
            var result = await _uploadCategoryPhotoCommand.ExecuteAsync(categoryId, file);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}