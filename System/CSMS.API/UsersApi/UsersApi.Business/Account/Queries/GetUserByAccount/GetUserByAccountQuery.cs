using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Account.ViewModes;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;
using UsersApi.Constants;
using UsersApi.Common.Enum;
using UsersApi.Constants.Message;
using UsersApi.Common.Securities.BCrypt;
using UsersApi.Constants.System;

namespace UsersApi.Business.Account.Queries.GetUserByAccount
{
    public class GetUserByAccountQuery : IGetUserByAccountQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;

        public GetUserByAccountQuery(IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserLoginViewModel> ExecuteAsync(string username, string inputPassword)
        {
            username = username.Trim().Replace(" ", "");

            UserLoginViewModel user = await _userRepository.TableNoTracking
                .Where(n => 
                n.Username == username &&
                (n.RoleId == null ? true : n.RoleId != RolesConstant.ROLE_CUSTOMER_ID) &&
                n.Deleted != true)
                .Select(n => new UserLoginViewModel()
                {
                    Id = n.Id,
                    UserCode = n.UserCode,
                    FirstName = n.FirstName,
                    LastName = n.LastName,
                    MiddleName = n.MiddleName,
                    UserName = n.Username,
                    PasswordHash = n.Password,
                    CreatedDate = n.CreateDate,
                    Enabled = n.Status.IsBlockAccess == true ? false : true,
                    Reason = MessageConstant.REASON_CANNOT_LOGIN + n.Status.Status.ToLower()
                })
                .SingleOrDefaultAsync();

            if (user == null || !BCrypt.CheckPassword(inputPassword, user.PasswordHash))
            {
                return null;
            }

            return user;
        }
    }
}
