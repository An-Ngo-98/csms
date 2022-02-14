using System.Collections.Generic;
using System.Threading.Tasks;
using UsersApi.Business.Role.ViewModels;

namespace UsersApi.Business.Role.Queries.GetAllRole
{
    public interface IGetAllRoleQuery
    {
        Task<List<UserRoleViewModel>> ExecuteAsync();
    }
}