using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InvoicesApi.Business.Statistic.Queries.GetStatisticData;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvoicesApi.Statistic
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        public readonly IGetStatisticDataQuery _getStatisticDataQuery;

        public StatisticsController(IGetStatisticDataQuery getStatisticDataQuery)
        {
            _getStatisticDataQuery = getStatisticDataQuery;
        }

        [HttpGet]
        public async Task<IActionResult> GetStatisticDataAsync(DateTime? startDate, DateTime? endDate)
        {
            DateTime now = DateTime.Now;
            var result = await _getStatisticDataQuery.ExecuteAsync(startDate ?? now.AddDays(-8), endDate ?? now.AddDays(-1));

            return new ObjectResult(result);
        }
    }
}