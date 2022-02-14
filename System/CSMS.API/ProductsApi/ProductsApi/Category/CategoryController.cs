using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductsApi.Business.Category.Commands.DeleteCategory;
using ProductsApi.Business.Category.Commands.SaveCategory;
using ProductsApi.Business.Category.Queries.GetEnableCategory;
using ProductsApi.Business.Category.Queries.GetListCategory;
using ProductsApi.Common.Commands;
using ProductsApi.Data.Entities;

namespace ProductsApi.Category
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IGetEnableCategoryQuery _getEnableCategoryQuery;
        private readonly IGetListCategoryQuery _getListCategoryQuery;
        private readonly ISaveCategoryCommand _saveCategoryCommand;
        private readonly IDeleteCategoryCommand _deleteCategoryCommand;

        public CategoryController(
            IGetListCategoryQuery getListCategoryQuery,
            IGetEnableCategoryQuery getEnableCategoryQuery,
            ISaveCategoryCommand saveCategoryCommand,
            IDeleteCategoryCommand deleteCategoryCommand)
        {
            _getEnableCategoryQuery = getEnableCategoryQuery;
            _getListCategoryQuery = getListCategoryQuery;
            _saveCategoryCommand = saveCategoryCommand;
            _deleteCategoryCommand = deleteCategoryCommand;
        }

        [HttpGet("GetListCategory/{page:int=1}/{pageSize:int=10}")]
        public async Task<IActionResult> GetListProductAsync(int page, int pageSize)
        {
            var result = await _getListCategoryQuery.ExecuteAsync(page, pageSize);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpGet("GetEnableCategory")]
        public async Task<IActionResult> GetEnableCategoryAsync()
        {
            var result = await _getEnableCategoryQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [HttpPost("SaveCategory")]
        public async Task<IActionResult> SaveProductAsync(CsmsCategory model)
        {
            var result = await _saveCategoryCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpDelete("DeleteCategory/{catId:int=0}")]
        //[Authorize(Policy = PermissionGroup.AdminHRM)]
        public async Task<IActionResult> DeleteCategoryAsync(int catId)
        {
            var result = await _deleteCategoryCommand.ExecuteAsync(catId);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}