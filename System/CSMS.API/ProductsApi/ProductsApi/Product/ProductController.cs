using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductsApi.Business.Product.Commands.DeleteProduct;
using ProductsApi.Business.Product.Commands.SaveProduct;
using ProductsApi.Business.Product.Queries.GetEnableProduct;
using ProductsApi.Business.Product.Queries.GetListProduct;
using ProductsApi.Business.Product.ViewModels;
using ProductsApi.Common.Commands;

namespace ProductsApi.Product
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IGetListProductQuery _getListProductQuery;
        private readonly IGetEnableProductQuery _getEnableProductQuery;
        private readonly ISaveProductCommand _saveProductCommand;
        private readonly IDeleteProductCommand _deleteProductCommand;

        public ProductController(
            IGetListProductQuery getListProductQuery,
            IGetEnableProductQuery getEnableProductQuery,
            IDeleteProductCommand deleteProductCommand,
            ISaveProductCommand saveProductCommand)
        {
            _getListProductQuery = getListProductQuery;
            _getEnableProductQuery = getEnableProductQuery;
            _saveProductCommand = saveProductCommand;
            _deleteProductCommand = deleteProductCommand;
        }

        [AllowAnonymous]
        [HttpGet("GetListProduct/{page:int=1}/{pageSize:int=10}/{sortField:int=1}")]
        public async Task<IActionResult> GetListProductAsync(int page, int pageSize, int sortField, int? categoryId, bool? Enabled, string searchString)
        {
            var result = await _getListProductQuery.ExecuteAsync(page, pageSize, sortField, categoryId, Enabled, searchString);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("GetEnableProduct")]
        public async Task<IActionResult> GetEnableProductAsync()
        {
            var result = await _getEnableProductQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [HttpPost("SaveProduct")]
        public async Task<IActionResult> SaveProductAsync(ProductViewModel model)
        {
            var result = await _saveProductCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpDelete("DeleteProduct/{productId:int=0}")]
        //[Authorize(Policy = PermissionGroup.AdminHRM)]
        public async Task<IActionResult> DeleteUserByUserIdAsync(int productId)
        {
            var result = await _deleteProductCommand.ExecuteAsync(productId);
            return new ObjectResult(result);
        }
    }
}