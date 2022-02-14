using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WarehouseApi.Business.Material.Commands.SaveMaterial;
using WarehouseApi.Business.Material.Queries.GetListMaterial;
using WarehouseApi.Common.Commands;
using WarehouseApi.Data.Entities;

namespace WarehouseApi.Material
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialsController : ControllerBase
    {
        private readonly IGetListMaterialQuery _getListMaterialQuery;
        private readonly ISaveMaterialCommand _saveMaterialCommand;

        public MaterialsController(
            IGetListMaterialQuery getListMaterialQuery,
            ISaveMaterialCommand saveMaterialCommand)
        {
            _getListMaterialQuery = getListMaterialQuery;
            _saveMaterialCommand = saveMaterialCommand;
        }

        [HttpGet("{page:int=1}/{pageSize:int=10}")]
        public async Task<IActionResult> GetMaterialsAsync(int page, int pageSize, string searchString)
        {
            var result = await _getListMaterialQuery.ExecuteAsync(page, pageSize, searchString);
            return new ObjectResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> SaveMaterial(CsmsMaterial model)
        {
            var result = await _saveMaterialCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}