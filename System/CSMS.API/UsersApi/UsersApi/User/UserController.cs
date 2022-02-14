using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UsersApi.Business.User.Commands.DeleteUserAddressByAddressId;
using UsersApi.Business.User.Commands.DeleteUserByUserId;
using UsersApi.Business.User.Commands.SaveUser;
using UsersApi.Business.User.Commands.SaveUserAddress;
using UsersApi.Business.User.Queries.GetUserInfoByUserId;
using UsersApi.Business.User.ViewModels;
using UsersApi.Common.Commands;
using UsersApi.Data.Entities;

namespace UsersApi.Information
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IGetUserInfoByUserIdQuery _getUserInfoByUserIdQuery;
        private readonly IDeleteUserByUserIdCommand _deleteUserByUserIdCommand;
        private readonly IDeleteUserAddressByAddressIdCommand _deleteAddressByAddressIdCommand;
        private readonly ISaveUserCommand _saveUserCommand;
        private readonly ISaveUserAddressCommand _saveUserAddressCommand;

        public UserController(
            IGetUserInfoByUserIdQuery getUserInfoByUserIdQuery,
            IDeleteUserByUserIdCommand deleteUserByUserIdCommand,
            IDeleteUserAddressByAddressIdCommand deleteAddressByAddressIdCommand,
            ISaveUserCommand saveUserCommand,
            ISaveUserAddressCommand saveUserAddressCommand)
        {
            _getUserInfoByUserIdQuery = getUserInfoByUserIdQuery;
            _deleteUserByUserIdCommand = deleteUserByUserIdCommand;
            _deleteAddressByAddressIdCommand = deleteAddressByAddressIdCommand;
            _saveUserCommand = saveUserCommand;
            _saveUserAddressCommand = saveUserAddressCommand;
        }

        [HttpGet("GetUserInfoByUserId/{userId:int=0}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetUserInfoByUserIdAsync(int userId)
        {
            UserInfoViewModel result = await _getUserInfoByUserIdQuery.ExecuteAsync(userId);
            return new ObjectResult(result);
        }

        [HttpPost("SaveUserInfo")]
        //[Authorize(Policy = PermissionGroup.AdminHRM)]
        public async Task<IActionResult> SaveUserInfoAsync([FromBody]SaveUserViewModel model)
        {
            var result = await _saveUserCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpPost("SaveUserAddress")]
        //[Authorize(Policy = PermissionGroup.AdminHRM)]
        public async Task<IActionResult> SaveUserAddressAsync(CsmsUserAddress model)
        {
            var result = await _saveUserAddressCommand.ExecuteAsync(model);
            return StatusCode(result.GetStatusCode(), result.GetData());
        }

        [HttpDelete("DeleteUserByUserId/{userId:int=0}")]
        //[Authorize(Policy = PermissionGroup.AdminHRM)]
        public async Task<IActionResult> DeleteUserByUserIdAsync(int userId)
        {
            var result = await _deleteUserByUserIdCommand.ExecuteAsync(userId);
            return new ObjectResult(result);
        }

        [HttpDelete("DeleteUserAddress/{addressId:int=0}")]
        //[Authorize(Policy = PermissionGroup.AdminHRM)]
        public async Task<IActionResult> DeleteUserAddressByAddressIdAsync(int addressId)
        {
            var result = await _deleteAddressByAddressIdCommand.ExecuteAsync(addressId);
            return new ObjectResult(result);
        }
    }
}