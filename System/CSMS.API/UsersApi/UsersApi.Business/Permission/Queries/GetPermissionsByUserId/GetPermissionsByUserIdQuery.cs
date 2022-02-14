using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Permission.ViewModels;
using UsersApi.Business.Role.Queries.GetRolesByUserId;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Permission.Queries.GetPermissionsByUserId
{
    public class GetPermissionsByUserIdQuery : IGetPermissionsByUserIdQuery
    {
        private readonly IRepository<CsmsUserPermission> _userPermisisonRepository;
        private readonly IRepository<CsmsPermission> _permissionRepository;
        private readonly IGetRolesByUserIdQuery _getRolesByUserIdQuery;

        public GetPermissionsByUserIdQuery(
            IRepository<CsmsUserPermission> userPermisisonRepository,
            IRepository<CsmsPermission> permissionRepository,
            IGetRolesByUserIdQuery getRolesByUserIdQuery)
        {
            _userPermisisonRepository = userPermisisonRepository;
            _permissionRepository = permissionRepository;
            _getRolesByUserIdQuery = getRolesByUserIdQuery;
        }

        public async Task<List<UserPermissionViewModel>> ExecuteAsync(int userId)
        {
            var result = await GetOtherPermissions(userId);
            result.AddRange(GetPermissionsByRoleAsync(userId).Result);

            return result;
        }

        private async Task<List<UserPermissionViewModel>> GetOtherPermissions(int userId)
        {
            var result = await _userPermisisonRepository.TableNoTracking
                .Where(n => n.UserId == userId)
                .Select(n => new UserPermissionViewModel()
                {
                    permissionId = n.Permisison.Id,
                    permissionName = n.Permisison.Permission,
                    permissionTitle = n.Permisison.Title
                })
                .ToListAsync();

            return result;
        }

        private Task<List<UserPermissionViewModel>> GetPermissionsByRoleAsync(int userId)
        {
            var roles = _getRolesByUserIdQuery.ExecuteAsync(userId).Result.Select(n => n.RoleId).ToList();

            var result = _permissionRepository.TableNoTracking
                .Where(n => roles.Contains(n.RoleId))
                .Select(n => new UserPermissionViewModel()
                {
                    permissionId = n.Id,
                    permissionName = n.Permission,
                    permissionTitle = n.Title
                })
                .ToListAsync();

            return result;
        }
    }
}
