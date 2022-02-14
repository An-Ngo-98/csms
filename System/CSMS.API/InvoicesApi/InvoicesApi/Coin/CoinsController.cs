using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InvoicesApi.Business.Coin.Queries.GetCoinHistoryByUserId;
using InvoicesApi.Business.Coin.Queries.GetCoinsByUserId;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvoicesApi.Coin
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoinsController : ControllerBase
    {
        private readonly IGetCoinsByUserIdQuery _getCoinsByUserIdQuery;
        private readonly IGetCoinHistoryByUserIdQuery _getCoinHistoryByUserIdQuery;

        public CoinsController(
            IGetCoinsByUserIdQuery getCoinsByUserIdQuery,
            IGetCoinHistoryByUserIdQuery getCoinHistoryByUserIdQuery)
        {
            _getCoinsByUserIdQuery = getCoinsByUserIdQuery;
            _getCoinHistoryByUserIdQuery = getCoinHistoryByUserIdQuery;
        }

        [HttpGet("{userId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCoinsByUserIdAsync(int userId)
        {
            var result = await _getCoinsByUserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }

        [HttpGet("history/{userId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCoinHistoryByUserIdAsync(int userId)
        {
            var result = await _getCoinHistoryByUserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }
    }
}