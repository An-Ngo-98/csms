using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using WarehouseApi.Business.Warehouse.Commands.ExportMaterial;
using WarehouseApi.Business.Warehouse.Commands.ImportMaterial;
using WarehouseApi.Business.Warehouse.Commands.SaveStoreWareHouse;
using WarehouseApi.Business.Warehouse.Commands.SetDefaultExportData;
using WarehouseApi.Business.Warehouse.Commands.SetDefaultImportData;
using WarehouseApi.Business.Warehouse.Queries.GetImportExportHistories;
using WarehouseApi.Business.Warehouse.Queries.GetStoreExportDefault;
using WarehouseApi.Business.Warehouse.Queries.GetStoreWarehouse;
using WarehouseApi.Business.Warehouse.Queries.GetWarehouseMaterial;
using WarehouseApi.Business.Warehouse.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Warehouse
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseController : ControllerBase
    {
        private readonly IGetWarehouseMaterialQuery _getWarehouseMaterialQuery;
        private readonly IGetStoreExportDefaultQuery _getStoreExportDefaultQuery;
        private readonly IImportMaterialCommand _importMaterialCommand;
        private readonly IExportMaterialCommand _exportMaterialCommand;
        private readonly ISetDefaultImportDataCommand _setDefaultImportDataCommand;
        private readonly ISetDefaultExportDataCommand _setDefaultExportDataCommand;
        private readonly IGetImportExportHistoriesQuery _getImportExportHistoriesQuery;
        private readonly IGetStoreWarehouseQuery _getStoreWarehouseQuery;
        private readonly ISaveStoreWareHouseCommand _saveStoreWareHouseCommand;

        public WarehouseController(
            IGetWarehouseMaterialQuery getWarehouseMaterialQuery,
            IGetStoreExportDefaultQuery getStoreExportDefaultQuery,
            IImportMaterialCommand importMaterialCommand,
            IExportMaterialCommand exportMaterialCommand,
            ISetDefaultImportDataCommand setDefaultImportDataCommand,
            ISetDefaultExportDataCommand setDefaultExportDataCommand,
            IGetImportExportHistoriesQuery getImportExportHistoriesQuery,
            IGetStoreWarehouseQuery getStoreWarehouseQuery,
            ISaveStoreWareHouseCommand saveStoreWareHouseCommand)
        {
            _getWarehouseMaterialQuery = getWarehouseMaterialQuery;
            _getStoreExportDefaultQuery = getStoreExportDefaultQuery;
            _importMaterialCommand = importMaterialCommand;
            _exportMaterialCommand = exportMaterialCommand;
            _setDefaultImportDataCommand = setDefaultImportDataCommand;
            _setDefaultExportDataCommand = setDefaultExportDataCommand;
            _getImportExportHistoriesQuery = getImportExportHistoriesQuery;
            _getStoreWarehouseQuery = getStoreWarehouseQuery;
            _saveStoreWareHouseCommand = saveStoreWareHouseCommand;
        }

        [HttpGet]
        public async Task<IActionResult> GetMaterialsAsync()
        {
            var result = await _getWarehouseMaterialQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [HttpGet("store-export-default")]
        public async Task<IActionResult> GetStoreExportDefaultAsync()
        {
            var result = await _getStoreExportDefaultQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [HttpGet("import-export-histories")]
        public async Task<IActionResult> GetImportExportHistoriesAsync(int? materialId)
        {
            var result = await _getImportExportHistoriesQuery.ExecuteAsync(materialId);
            return new ObjectResult(result);
        }

        [HttpGet("store-warehouse/{branchId:int}")]
        public async Task<IActionResult> GetStoreWarehouseAsync(int branchId)
        {
            var result = await _getStoreWarehouseQuery.ExecuteAsync(branchId);
            return new ObjectResult(result);
        }

        [HttpPost("import-materials")]
        public async Task<IActionResult> ImportMaterialAsync(dynamic data)
        {
            List<ImportMaterialViewModel> listMaterial = JsonConvert.DeserializeObject<List<ImportMaterialViewModel>>(data.ToString());
            var result = await _importMaterialCommand.ExecuteAsync(listMaterial);

            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPost("export-materials")]
        public async Task<IActionResult> ExportMaterialAsync(dynamic data)
        {
            List<ExportMaterialViewModel> listMaterial = JsonConvert.DeserializeObject<List<ExportMaterialViewModel>>(data.ToString());
            var result = await _exportMaterialCommand.ExecuteAsync(listMaterial);

            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPost("set-default-import")]
        public async Task<IActionResult> SetDefaultImportMaterialAsync(dynamic data)
        {
            List<ImportMaterialViewModel> listMaterial = JsonConvert.DeserializeObject<List<ImportMaterialViewModel>>(data.ToString());
            var result = await _setDefaultImportDataCommand.ExecuteAsync(listMaterial);

            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPost("set-default-export")]
        public async Task<IActionResult> SetDefaultExportMaterialAsync(dynamic data)
        {
            List<ExportMaterialViewModel> listMaterial = JsonConvert.DeserializeObject<List<ExportMaterialViewModel>>(data.ToString());
            var result = await _setDefaultExportDataCommand.ExecuteAsync(listMaterial);

            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPost("save-store-warehouse")]
        public async Task<IActionResult> SaveStoreWarehouseAsync(dynamic data)
        {
            List<StoreMaterialViewModel> listMaterial = JsonConvert.DeserializeObject<List<StoreMaterialViewModel>>(data.ToString());
            var result = await _saveStoreWareHouseCommand.ExecuteAsync(listMaterial);

            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}