using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Role.ViewModels;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Role.Queries.GetAllRole
{
    public class GetAllRoleQuery : IGetAllRoleQuery
    {
        private readonly IRepository<CsmsRole> _roleRepository;

        public GetAllRoleQuery(IRepository<CsmsRole> roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<List<UserRoleViewModel>> ExecuteAsync()
        {
            var result = await _roleRepository.TableNoTracking
                .Select(n => new UserRoleViewModel()
                {
                    RoleId = n.Id,
                    RoleName = n.Role,
                    RoleTitle = n.Title
                })
                .ToListAsync();

            return result;
        }
    }
}
