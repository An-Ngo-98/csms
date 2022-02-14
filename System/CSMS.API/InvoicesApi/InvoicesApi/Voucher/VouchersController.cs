using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InvoicesApi.Business.Voucher.Queries.GetUsedVouchersByUserId;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvoicesApi.Voucher
{
    [Route("api/[controller]")]
    [ApiController]
    public class VouchersController : ControllerBase
    {
        private readonly IGetUsedVouchersByUserIdQuery _getUsedVouchersByUserIdQuery;

        public VouchersController(IGetUsedVouchersByUserIdQuery getUsedVouchersByUserIdQuery)
        {
            _getUsedVouchersByUserIdQuery = getUsedVouchersByUserIdQuery;
        }

        [HttpGet("used-vouchers/{userId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUsedVouchersByUserIdAsync(int userId)
        {
            var result = await _getUsedVouchersByUserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }
    }
}