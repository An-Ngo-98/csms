using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UsersApi.Business.Customer.Commands.SaveCustomer;
using UsersApi.Business.Customer.Queries.ExportListCustomer;
using UsersApi.Business.Customer.Queries.GetListAddressByUserId;
using UsersApi.Business.Customer.Queries.GetListCustomer;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Constants;

namespace UsersApi.Customer
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IGetListCustomerQuery _getListCustomerQuery;
        private readonly ISaveCustomerCommand _saveCustomerCommand;
        private readonly IExportListCustomerQuery _exportListCustomerQuery;
        private readonly IGetListAddressByUserIdQuery _getListAddressByuserIdQuery;

        public CustomerController(
            IGetListCustomerQuery getListCustomerQuery,
            ISaveCustomerCommand saveCustomerCommand,
            IExportListCustomerQuery exportListCustomerQuery,
            IGetListAddressByUserIdQuery getListAddressByuserIdQuery)
        {
            _getListCustomerQuery = getListCustomerQuery;
            _saveCustomerCommand = saveCustomerCommand;
            _exportListCustomerQuery = exportListCustomerQuery;
            _getListAddressByuserIdQuery = getListAddressByuserIdQuery;
        }

        [HttpGet("GetListCustomer/{page:int=1}/{pageSize:int=10}/{sortField:int=1}/{sortType:int=1}")]
        public async Task<IActionResult> GetListCustomerAsync(int page, int pageSize, int sortField, int sortType, int? customerStatus, string searchString)
        {
            var result = await _getListCustomerQuery.ExecuteAsync(page, pageSize, sortField, sortType, customerStatus, searchString);
            return new ObjectResult(result);
        }

        [HttpGet("addresses/{userId:int=0}")]
        public async Task<IActionResult> GetListAddressAsync(int userId)
        {
            var result = await _getListAddressByuserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }

        [HttpGet("ExportListCustomer/{exportType:int=0}")]
        public async Task<IActionResult> ExportListCustomerAsync(int exportType, string listUserId, string searchCondition)
        {
            var result = await _exportListCustomerQuery.ExecuteAsync(exportType, listUserId, searchCondition);
            return File(result, KnownFileType.XLSX);
        }

        [HttpPut("update-information")]
        public async Task<IActionResult> UpdateInfoAsync([FromBody]SaveCustomerViewModel model)
        {
            var result = await _saveCustomerCommand.ExecuteAsync(model);
            return new ObjectResult(result);
        }
    }
}