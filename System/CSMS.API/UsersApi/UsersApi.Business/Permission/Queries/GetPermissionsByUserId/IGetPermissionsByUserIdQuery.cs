using System.Collections.Generic;
using System.Threading.Tasks;
using UsersApi.Business.Permission.ViewModels;

namespace UsersApi.Business.Permission.Queries.GetPermissionsByUserId
{
    public interface IGetPermissionsByUserIdQuery
    {
        Task<List<UserPermissionViewModel>> ExecuteAsync(int userId);
    }
}