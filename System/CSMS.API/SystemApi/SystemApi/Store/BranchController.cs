using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SystemApi.Business.Branch.Commands.DeleteBranch;
using SystemApi.Business.Branch.Commands.SaveBranch;
using SystemApi.Business.Branch.Queries.GetBranch;
using SystemApi.Business.Branch.Queries.GetEnableBranch;
using SystemApi.Business.Branch.Queries.GetEnableProvince;
using SystemApi.Business.Branch.ViewModels;
using SystemApi.Common.Commands;

namespace SystemApi.Store
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        private readonly IGetBranchQuery _getBranchQuery;
        private readonly IGetEnableBranchQuery _getEnableBranchQuery;
        private readonly IGetEnableProvinceQuery _getEnableProvinceQuery;
        private readonly ISaveBranchCommand _saveBranchCommand;
        private readonly IDeleteBranchCommand _deleteBranchCommand;

        public BranchController(
            IGetBranchQuery getBranchQuery,
            IGetEnableBranchQuery getEnableBranchQuery,
            IGetEnableProvinceQuery getEnableProvinceQuery,
            ISaveBranchCommand saveBranchCommand,
            IDeleteBranchCommand deleteBranchCommand)
        {
            _getBranchQuery = getBranchQuery;
            _getEnableBranchQuery = getEnableBranchQuery;
            _getEnableProvinceQuery = getEnableProvinceQuery;
            _saveBranchCommand = saveBranchCommand;
            _deleteBranchCommand = deleteBranchCommand;
        }

        [HttpGet("GetAllBranch/{page:int=1}/{pageSize:int=10}")]
        public async Task<IActionResult> GetAllBranchAsync(int page, int pageSize)
        {
            var result = await _getBranchQuery.ExecuteAsync(page, pageSize);
            return new ObjectResult(result);
        }

        [HttpGet("GetAllEnableBranch")]
        public async Task<IActionResult> GetAllEnableBranchAsync()
        {
            var result = await _getEnableBranchQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [HttpGet("provinces")]
        public async Task<IActionResult> GetEnableProvinceAsync()
        {
            var result = await _getEnableProvinceQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [HttpPost("SaveBranch")]
        //[Authorize(Policy = PermissionGroup.AdminHRM)]
        public async Task<IActionResult> SaveBranchAsync(BranchViewModel model)
        {
            var result = await _saveBranchCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpDelete("DeleteBranch/{branchId:int=0}")]
        //[Authorize(Policy = PermissionGroup.AdminHRM)]
        public async Task<IActionResult> DeleteBranchAsync(int branchId)
        {
            var result = await _deleteBranchCommand.ExecuteAsync(branchId);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}