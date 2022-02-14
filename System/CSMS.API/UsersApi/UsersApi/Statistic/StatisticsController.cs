using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UsersApi.Business.User.Queries.GetNewUsers;

namespace UsersApi.Statistic
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IGetNewUsersQuery _getNewUsersQuery;

        public StatisticsController(IGetNewUsersQuery getNewUsersQuery)
        {
            _getNewUsersQuery = getNewUsersQuery;
        }

        [HttpGet("number-of-new-users")]
        public async Task<IActionResult> GetNumberOfNewUsersAsync(DateTime? startDate, DateTime? endDate)
        {
            DateTime now = DateTime.Now;
            var result = await _getNewUsersQuery.ExecuteAsync(startDate ?? now.AddDays(-8), endDate ?? now.AddDays(-1));

            return new ObjectResult(result.Count);
        }
    }
}