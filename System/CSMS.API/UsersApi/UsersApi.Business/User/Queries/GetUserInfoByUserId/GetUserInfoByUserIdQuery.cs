using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.User.ViewModels;
using UsersApi.Common.Enum;
using UsersApi.Constants;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.User.Queries.GetUserInfoByUserId
{
    public class GetUserInfoByUserIdQuery : IGetUserInfoByUserIdQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;

        public GetUserInfoByUserIdQuery(IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserInfoViewModel> ExecuteAsync(int userId)
        {
            UserInfoViewModel user = await _userRepository.TableNoTracking
                .Where(n => n.Id == userId && n.Deleted != true)
                .Select(n => new UserInfoViewModel()
                {
                    Id = n.Id,
                    UserCode = n.UserCode,
                    UserName = n.Username,
                    FirstName = n.FirstName,
                    LastName = n.LastName,
                    MiddleName = n.MiddleName,
                    Email = n.Email,
                    PhoneNumber = n.PhoneNumber,
                    CitizenId = n.CitizenID,
                    Gender = n.Gender,
                    Birthday = n.Birthday,
                    Addresses = n.Addresses
                        .Select(x => new UserAddressViewModel()
                        {
                            Id = x.Id,
                            Receiver = x.Receiver,
                            PhoneNumber = x.PhoneNumber,
                            Country = x.Country,
                            Province = x.Province,
                            District = x.District,
                            Ward = x.Ward,
                            Detail = x.Detail,
                            IsDefault = x.IsDefault ?? false
                        })
                        .ToList(),
                    StatusId = n.StatusId,
                    Salary = n.Salary,
                    BranchId = n.BranchId,
                    RoleId = n.RoleId,
                    Status = n.Status.Status,
                    CreatedDate = n.CreateDate
                })
                .SingleOrDefaultAsync();

            return user;
        }
    }
}
