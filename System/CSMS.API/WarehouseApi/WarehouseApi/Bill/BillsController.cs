using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WarehouseApi.Business.Bill.Commands.PayBill;
using WarehouseApi.Business.Bill.Queries.GetListBill;
using WarehouseApi.Business.Bill.ViewModels;
using WarehouseApi.Common.Commands;

namespace WarehouseApi.Bill
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillsController : ControllerBase
    {
        private readonly IGetListBillQuery _getListBillQuery;
        private readonly IPayBillCommand _payBillCommand;

        public BillsController(
            IGetListBillQuery getListBillQuery,
            IPayBillCommand payBillCommand)
        {
            _getListBillQuery = getListBillQuery;
            _payBillCommand = payBillCommand;
        }

        [HttpGet]
        public async Task<IActionResult> GetListBillsAsync(int month, int year)
        {
            var result = await _getListBillQuery.ExecuteAsync(month, year);
            return new ObjectResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> PayBillAsync(BillViewModel model)
        {
            var result = await _payBillCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}