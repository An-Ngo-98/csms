using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CdnApi.Business.FileDefault.Commands.UploadFileDefault;
using CdnApi.Business.FileDefault.Queries.GetListDefaultFiles;
using CdnApi.Business.FileDefault.Queries.GetPhotoByFileId;
using CdnApi.Common.Extensions;
using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CdnApi.FileDefault
{
    [Route("api/default-files")]
    [ApiController]
    public class DefaultFilesController : ControllerBase
    {
        private readonly IGetListDefaultFilesQuery _getListDefaultFilesQuery;
        private readonly IGetPhotoByFileIdQuery _getPhotoByFileIdQuery;
        private readonly IUploadFileDefaultCommand _uploadFileDefaultCommand;

        public DefaultFilesController(
            IGetListDefaultFilesQuery getListDefaultFilesQuery,
            IGetPhotoByFileIdQuery getPhotoByFileIdQuery,
            IUploadFileDefaultCommand uploadFileDefaultCommand)
        {
            _getListDefaultFilesQuery = getListDefaultFilesQuery;
            _getPhotoByFileIdQuery = getPhotoByFileIdQuery;
            _uploadFileDefaultCommand = uploadFileDefaultCommand;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetListDefaultFilesAsync()
        {
            var result = await _getListDefaultFilesQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("{fileId:int=0}")]
        public async Task<IActionResult> GetPhotoByFileIdAsync(int fileId, int size = 600)
        {
            var photo = await _getPhotoByFileIdQuery.ExecuteAsync(fileId);
            if (photo == null)
            {
                return BadRequest();
            }
            byte[] resized = ImageProcessing.CreateThumbnail(photo.FileContent, size);

            return new FileContentResult(resized, photo.FileType);
        }

        [AllowAnonymous]
        [HttpPost("{defaultFileType}/{title}")]
        public async Task<IActionResult> UploadCategoryPhotoAsync(string defaultFileType, string title, IFormFile file)
        {
            var result = await _uploadFileDefaultCommand.ExecuteAsync(defaultFileType, title, file);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}