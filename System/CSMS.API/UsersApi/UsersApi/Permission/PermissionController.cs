using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UsersApi.Business.Permission.Queries.GetPermissionsByUserId;

namespace UsersApi.Permission
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IGetPermissionsByUserIdQuery _getPermissionsByUserIdQuery;

        public PermissionController(IGetPermissionsByUserIdQuery getPermissionsByUserIdQuery)
        {
            _getPermissionsByUserIdQuery = getPermissionsByUserIdQuery;
        }

        [HttpGet("GetPermissionsByUserId/{userId:int=0}")]
        public async Task<IActionResult> GetPermissionByUserId(int userId)
        {
            var result = await _getPermissionsByUserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }
    }
}