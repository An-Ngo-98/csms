using CdnApi.Business.Product.Commands.DeleteProductPhoto;
using CdnApi.Business.Product.Commands.UploadProductPhoto;
using CdnApi.Business.Product.Queries.GetProductPhoto;
using CdnApi.Common.Extensions;
using CdnApi.CrossCutting.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CdnApi.Product
{
    [Route("api/products/photo")]
    [ApiController]
    public class ProductPhotoController : ControllerBase
    {
        private readonly IGetProductPhotoQuery _getProductPhotoQuery;
        private readonly IUploadProductPhotoCommand _uploadProductPhotoCommand;
        private readonly IDeleteProductPhotoCommand _deleteProductPhotoCommand;

        public ProductPhotoController(
            IGetProductPhotoQuery getProductPhotoQuery,
            IUploadProductPhotoCommand uploadProductPhotoCommand,
            IDeleteProductPhotoCommand deleteProductPhotoCommand)
        {
            _getProductPhotoQuery = getProductPhotoQuery;
            _uploadProductPhotoCommand = uploadProductPhotoCommand;
            _deleteProductPhotoCommand = deleteProductPhotoCommand;
        }

        [AllowAnonymous]
        [HttpGet("{imageId}/{size:int=600}")]
        public async Task<IActionResult> GetProductPhotoAsync(int imageId, int size)
        {
            var photo = await _getProductPhotoQuery.ExecuteAsync(imageId);
            if (photo == null)
            {
                return BadRequest();
            }
            byte[] resized = ImageProcessing.CreateThumbnail(photo.Content, size);
            return new FileContentResult(resized, photo.FileType);
        }

        [AllowAnonymous]
        [HttpPost("{imageId:int=0}")]
        public async Task<IActionResult> UploadProductPhotoAsync(int imageId, IFormFile file)
        {
            var result = await _uploadProductPhotoCommand.ExecuteAsync(imageId, file);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [AllowAnonymous]
        [HttpDelete("{imageId:int=0}")]
        public async Task<IActionResult> DeleteProductPhotoAsync(int imageId)
        {
            var result = await _deleteProductPhotoCommand.ExecuteAsync(imageId);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}