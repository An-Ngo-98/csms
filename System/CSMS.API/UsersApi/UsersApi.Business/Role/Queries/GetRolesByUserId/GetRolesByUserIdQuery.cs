using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Role.ViewModels;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Role.Queries.GetRolesByUserId
{
    public class GetRolesByUserIdQuery : IGetRolesByUserIdQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;

        public GetRolesByUserIdQuery(IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserRoleViewModel>> ExecuteAsync(int userId)
        {
            var result = await _userRepository.TableNoTracking
                .Where(n => n.Id == userId)
                .Select(n => new UserRoleViewModel()
                {
                    RoleId = n.Role.Id,
                    RoleName = n.Role.Role,
                    RoleTitle = n.Role.Title
                })
                .ToListAsync();

            return result;
        }
    }
}
