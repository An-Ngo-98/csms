using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UsersApi.Business.Role.Queries.GetAllRole;
using UsersApi.Business.Role.Queries.GetRolesByUserId;

namespace UsersApi.Role
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IGetRolesByUserIdQuery _getRolesByUserIdQuery;
        private readonly IGetAllRoleQuery _getAllRoleQuery;

        public RoleController(
            IGetRolesByUserIdQuery getRolesByUserIdQuery,
            IGetAllRoleQuery getAllRoleQuery)
        {
            _getRolesByUserIdQuery = getRolesByUserIdQuery;
            _getAllRoleQuery = getAllRoleQuery;
        }

        [HttpGet("GetListRole")]
        public async Task<IActionResult> GetListRoleAsync()
        {
            var result = await _getAllRoleQuery.ExecuteAsync();
            return new ObjectResult(result);
        }

        [HttpGet("GetRolesByUserId/{userId:int=0}")]
        public async Task<IActionResult> GetRolesByUserIdAsync(int userId)
        {
            var result = await _getRolesByUserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }
    }
}