using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Account.ViewModes;
using UsersApi.Common.Securities.BCrypt;
using UsersApi.Constants.Message;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Account.Queries.GetCustomerByAccount
{
    public class GetCustomerByAccountQuery : IGetCustomerByAccountQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;

        public GetCustomerByAccountQuery(IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserLoginViewModel> ExecuteAsync(string username, string inputPassword)
        {
            username = username.Trim().Replace(" ", "");

            UserLoginViewModel user = await _userRepository.TableNoTracking
                .Where(n => (n.Email == username || n.PhoneNumber == username) && n.Deleted != true)
                .Select(n => new UserLoginViewModel()
                {
                    Id = n.Id,
                    UserCode = n.UserCode,
                    FirstName = n.FirstName,
                    LastName = n.LastName,
                    MiddleName = n.MiddleName,
                    UserName = n.Username,
                    Email = n.Email,
                    PhoneNumber = n.PhoneNumber,
                    PasswordHash = n.Password,
                    Birthday = n.Birthday,
                    Gender = n.Gender,
                    CreatedDate = n.CreateDate,
                    Enabled = n.Status.IsBlockAccess == true ? false : true,
                    Reason = MessageConstant.REASON_CANNOT_LOGIN + n.Status.Status.ToLower()
                })
                .FirstOrDefaultAsync();

            if (user == null || !BCrypt.CheckPassword(inputPassword, user.PasswordHash))
            {
                return null;
            }

            return user;
        }
    }
}
