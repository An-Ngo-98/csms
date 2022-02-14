using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductsApi.Business.Branch.Commands.UpdateStoreProduct;
using ProductsApi.Business.Branch.Queries.GetProductByBranchId;
using ProductsApi.Business.Product.ViewModels;

namespace ProductsApi.Branch
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        private readonly IGetProductByBranchIdQuery _getProductByBranchIdQuery;
        private readonly IUpdateStoreProductCommand _updateStoreProductCommand;

        public BranchController(
            IGetProductByBranchIdQuery getProductByBranchIdQuery,
            IUpdateStoreProductCommand updateStoreProductCommand)
        {
            _getProductByBranchIdQuery = getProductByBranchIdQuery;
            _updateStoreProductCommand = updateStoreProductCommand;
        }

        [AllowAnonymous]
        [HttpGet("GetProductByBranchId/{branchId:int=0}")]
        public async Task<IActionResult> GetProductByBranchIdAsync(int branchId)
        {
            var result = await _getProductByBranchIdQuery.ExecuteAsync(branchId);
            return new ObjectResult(result);
        }

        [AllowAnonymous]
        [HttpPut("UpdateStoreProduct/{branchId:int=0}")]
        public async Task<IActionResult> UpdateStoreProductAsync(int branchId, List<EnableProductViewModel> listProduct)
        {
            var result = await _updateStoreProductCommand.ExecuteAsync(branchId, listProduct);
            return new ObjectResult(result);
        }
    }
}