using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InvoicesApi.Business.Order.Commands.AddOrder;
using InvoicesApi.Business.Order.Commands.UpdateStatusOrder;
using InvoicesApi.Business.Order.Queries.ExportListInvoice;
using InvoicesApi.Business.Order.Queries.GetListOrder;
using InvoicesApi.Business.Order.Queries.GetListOrderByUserId;
using InvoicesApi.Business.Order.Queries.GetOrderById;
using InvoicesApi.Business.Order.Queries.GetTodayOrders;
using InvoicesApi.Common.Commands;
using InvoicesApi.Common.Enums;
using InvoicesApi.Constants;
using InvoicesApi.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvoicesApi.Order
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IGetListOrderQuery _getListOrderQuery;
        private readonly IGetListOrderByUserIdQuery _getListOrderByUserIdQuery;
        private readonly IGetOrderByIdQuery _getOrderByIdQuery;
        private readonly IGetTodayOrdersQuery _getTodayOrdersQuery;
        private readonly IExportListInvoiceQuery _exportListInvoiceQuery;
        private readonly IAddOrderCommand _addOrderCommand;
        private readonly IUpdateStatusOrderCommand _updateStatusOrderCommand;

        public OrdersController(
            IGetListOrderQuery getListOrderQuery,
            IGetListOrderByUserIdQuery getListOrderByUserIdQuery,
            IGetOrderByIdQuery getOrderByIdQuery,
            IGetTodayOrdersQuery getTodayOrdersQuery,
            IExportListInvoiceQuery exportListInvoiceQuery,
            IAddOrderCommand addOrderCommand,
            IUpdateStatusOrderCommand updateStatusOrderCommand)
        {
            _getListOrderQuery = getListOrderQuery;
            _getListOrderByUserIdQuery = getListOrderByUserIdQuery;
            _getOrderByIdQuery = getOrderByIdQuery;
            _getTodayOrdersQuery = getTodayOrdersQuery;
            _exportListInvoiceQuery = exportListInvoiceQuery;
            _addOrderCommand = addOrderCommand;
            _updateStatusOrderCommand = updateStatusOrderCommand;
        }

        [HttpGet("{page}/{pageSize}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetListOrderAsync(int page, int pageSize, int? statusCode, int? voucherId,
            DateTime? startTime, DateTime? endTime, string searchString, string storeIds)
        {
            int[] listStoreIds = null;
            if (!string.IsNullOrEmpty(storeIds))
            {
                listStoreIds = storeIds.Split(",").Select(int.Parse).ToArray();
            }

            var result = await _getListOrderQuery.ExecuteAsync(page, pageSize, statusCode, voucherId, startTime, endTime, searchString, listStoreIds);
            return new ObjectResult(result);
        }

        [HttpGet("{userId:int=0}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetListOrderByUserIdAsync(int userId)
        {
            var result = await _getListOrderByUserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }

        [HttpGet("{orderId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOrderByIdAsync(string orderId)
        {
            var result = await _getOrderByIdQuery.ExecuteAsync(orderId);
            return new ObjectResult(result);
        }

        [HttpGet("today-orders/{orderStatus}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOrderByIdAsync(string storeIds, int orderStatus = (int)OrderStatus.Pending)
        {
            var result = await _getTodayOrdersQuery.ExecuteAsync(orderStatus, storeIds);
            return new ObjectResult(result);
        }

        [HttpGet("export-invoices/{exportType:int=0}")]
        //[Authorize(Policy = PermissionGroup.AdminEmployeeManagement)]
        public async Task<IActionResult> ExportListEmployeeAsync(int exportType, string listInvoiceIds, string searchCondition)
        {
            var result = await _exportListInvoiceQuery.ExecuteAsync(exportType, listInvoiceIds, searchCondition);
            return File(result, KnownFileType.XLSX);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> AddOrderAsync(CsmsOrder model)
        {
            var result = await _addOrderCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPut("cook-time/{orderId}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateCookTimeAsync(string orderId)
        {
            var result = await _updateStatusOrderCommand.ExecuteAsync(orderId, (int)OrderStatus.Cooking);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPut("ship-time/{orderId}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateShipTimeAsync(string orderId)
        {
            var result = await _updateStatusOrderCommand.ExecuteAsync(orderId, (int)OrderStatus.Shipping);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPut("completed-time/{orderId}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateCompletedTimeAsync(string orderId)
        {
            var result = await _updateStatusOrderCommand.ExecuteAsync(orderId, (int)OrderStatus.Completed);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPut("canceled-time/{orderId}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateCanceledTimeAsync(string orderId)
        {
            var result = await _updateStatusOrderCommand.ExecuteAsync(orderId, (int)OrderStatus.Canceled);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }
    }
}