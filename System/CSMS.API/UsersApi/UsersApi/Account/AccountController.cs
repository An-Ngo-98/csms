using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using UsersApi.Account.ViewModels;
using UsersApi.Business.Account.Commands.ChangePassword;
using UsersApi.Business.Account.Queries.GetCustomerByAccount;
using UsersApi.Business.Account.Queries.GetCustomerInfoFromAccessToken;
using UsersApi.Business.Account.Queries.GetUserByAccount;
using UsersApi.Business.Account.ViewModes;
using UsersApi.Business.Customer.Commands.SaveCustomer;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Common.Commands;
using UsersApi.Constants;
using UsersApi.Constants.Message;
using UsersApi.Framework.Authentication;
using UsersApi.Framework.Configuration.Options;

namespace UsersApi.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IGetUserByAccountQuery _getUserByAccountQuery;
        private readonly IGetCustomerByAccountQuery _getCustomerByAccountQuery;
        private readonly ISaveCustomerCommand _saveCustomerCommand;
        private readonly IChangePasswordCommand _changePasswordCommand;
        private readonly IGetCustomerInfoFromAccessTokenQuery _getCustomerInfoFromAccessTokenQuery;
        private readonly IOptionsSnapshot<JwtOptions> _jwtConfiguration;

        public AccountController(
            IOptionsSnapshot<JwtOptions> jwtConfiguration,
           ISaveCustomerCommand saveCustomerCommand,
            IGetUserByAccountQuery getUserByAccountQuery,
            IChangePasswordCommand changePasswordCommand,
            IGetCustomerInfoFromAccessTokenQuery getCustomerInfoFromAccessTokenQuery,
            IGetCustomerByAccountQuery getCustomerByAccountQuery)
        {
            _jwtConfiguration = jwtConfiguration;
            _saveCustomerCommand = saveCustomerCommand;
            _getUserByAccountQuery = getUserByAccountQuery;
            _changePasswordCommand = changePasswordCommand;
            _getCustomerInfoFromAccessTokenQuery = getCustomerInfoFromAccessTokenQuery;
            _getCustomerByAccountQuery = getCustomerByAccountQuery;
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<ActionResult> LoginAsync(LoginViewModel loginViewModel)
        {
            UserLoginViewModel user = await _getUserByAccountQuery.ExecuteAsync(loginViewModel.Username, loginViewModel.Password);

            if (user != null)
            {
                if (!user.Enabled)
                {
                    return StatusCode((int)HttpStatusCode.Forbidden, new { message = user.Reason });
                }

                var jwtOptions = _jwtConfiguration.Value;
                jwtOptions.ValidFor = loginViewModel.RememberMe ? TimeSpan.FromHours(JwtValidTime.HAS_REMEMBER_ME_BY_HOURS)
                    : TimeSpan.FromHours(JwtValidTime.NOT_HAVE_REMEMBER_ME_BY_HOURS);

                var jwtUserAccount = new JwtUserAccount
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    UserCode = user.UserCode,
                    LastName = user.LastName,
                    MiddleName = user.MiddleName,
                    FirstName = user.FirstName
                };

                return new ObjectResult(new { accessToken = jwtUserAccount.GenerateToken(jwtOptions) });
            }

            return StatusCode((int)HttpStatusCode.Unauthorized, new { message = MessageConstant.WRONG_USERNAME_PASSWORD });
        }

        [HttpPost]
        [Route("customer/login")]
        [AllowAnonymous]
        public async Task<ActionResult> CustomerLoginAsync(LoginViewModel loginViewModel)
        {
            UserLoginViewModel user = await _getCustomerByAccountQuery.ExecuteAsync(loginViewModel.Username, loginViewModel.Password);

            if (user != null)
            {
                if (!user.Enabled)
                {
                    return StatusCode((int)HttpStatusCode.Forbidden, new { message = user.Reason });
                }

                var jwtOptions = _jwtConfiguration.Value;
                jwtOptions.ValidFor = TimeSpan.FromHours(JwtValidTime.FOR_CUSTOMER_BY_HOURS);

                var jwtUserAccount = new JwtUserAccount
                {
                    UserId = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    LastName = user.LastName,
                    MiddleName = user.MiddleName,
                    FirstName = user.FirstName
                };

                TokenViewModel tokenVM = new TokenViewModel()
                {
                    Id = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    LastName = user.LastName,
                    MiddleName = user.MiddleName,
                    FirstName = user.FirstName,
                    Birthday = user.Birthday,
                    Gender = user.Gender,
                    CreatedDate = user.CreatedDate,
                    AccessToken = jwtUserAccount.GenerateToken(jwtOptions)
                };

                return new ObjectResult(tokenVM);
            }

            return StatusCode((int)HttpStatusCode.Unauthorized, new { message = MessageConstant.WRONG_USERNAME_PASSWORD });
        }

        [HttpPost]
        [Route("customer/register")]
        [AllowAnonymous]
        public async Task<ActionResult> RegisterAsync([FromBody]SaveCustomerViewModel model)
        {
            var result = await _saveCustomerCommand.ExecuteAsync(model);

            if (!result.Succeeded)
            {
                return new ObjectResult(result);
            }

            CustomerViewModel user = result.Data as CustomerViewModel;

            if (user != null)
            {
                var jwtOptions = _jwtConfiguration.Value;
                jwtOptions.ValidFor = TimeSpan.FromHours(JwtValidTime.FOR_CUSTOMER_BY_HOURS);

                var jwtUserAccount = new JwtUserAccount
                {
                    UserId = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    LastName = user.LastName,
                    MiddleName = user.MiddleName,
                    FirstName = user.FirstName
                };

                TokenViewModel tokenVM = new TokenViewModel()
                {
                    Id = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    LastName = user.LastName,
                    MiddleName = user.MiddleName,
                    FirstName = user.FirstName,
                    Birthday = user.Birthday,
                    Gender = user.Gender,
                    CreatedDate = user.CreatedDate,
                    AccessToken = jwtUserAccount.GenerateToken(jwtOptions)
                };

                return new ObjectResult(CommandResult.SuccessWithData(tokenVM));
            }

            return new ObjectResult(CommandResult.Failed(new CommandResultError()
            {
                Code = (int)HttpStatusCode.InternalServerError,
                Description = MessageConstant.SYSTEM_ERROR
            }));
        }

        [HttpPost]
        [Route("customer/registerSocial")]
        [AllowAnonymous]
        public async Task<ActionResult> RegisterSocialAsync([FromBody]SaveCustomerSocialViewModel model)
        {
            var result = await _saveCustomerCommand.ExecuteSocialAsync(model);

            if (!result.Succeeded)
            {
                return new ObjectResult(result);
            }

            CustomerViewModel user = result.Data as CustomerViewModel;

            if (user != null)
            {
                var jwtOptions = _jwtConfiguration.Value;
                jwtOptions.ValidFor = TimeSpan.FromHours(JwtValidTime.FOR_CUSTOMER_BY_HOURS);

                var jwtUserAccount = new JwtUserAccount
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName
                };

                TokenViewModel tokenVM = new TokenViewModel()
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    CreatedDate = user.CreatedDate,
                    AccessToken = jwtUserAccount.GenerateToken(jwtOptions)
                };

                return new ObjectResult(CommandResult.SuccessWithData(tokenVM));
            }

            return new ObjectResult(CommandResult.Failed(new CommandResultError()
            {
                Code = (int)HttpStatusCode.InternalServerError,
                Description = MessageConstant.SYSTEM_ERROR
            }));
        }

        [HttpPut]
        [Route("change-password")]
        [AllowAnonymous]
        public async Task<ActionResult> ChangePasswordAsync(ChangePasswordViewModel model)
        {
            var result = await _changePasswordCommand.ExecuteAsync(model);
            return new ObjectResult(result);
        }

        [HttpPost("customer/get-info-from-access-token")]
        [AllowAnonymous]
        public async Task<CustomerViewModel> GetCustomerInfoFromAccessTokenAsync([FromBody] JObject jsonObject)
        {
            return await _getCustomerInfoFromAccessTokenQuery.ExecuteAsync(jsonObject["accessToken"].ToString());
        }
    }
}