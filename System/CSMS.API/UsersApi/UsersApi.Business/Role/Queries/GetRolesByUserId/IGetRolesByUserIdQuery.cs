using System.Collections.Generic;
using System.Threading.Tasks;
using UsersApi.Business.Role.ViewModels;

namespace UsersApi.Business.Role.Queries.GetRolesByUserId
{
    public interface IGetRolesByUserIdQuery
    {
        Task<List<UserRoleViewModel>> ExecuteAsync(int userId);
    }
}
