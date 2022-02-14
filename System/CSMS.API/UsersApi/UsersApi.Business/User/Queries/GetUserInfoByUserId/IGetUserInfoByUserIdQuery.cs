using System.Threading.Tasks;
using UsersApi.Business.User.ViewModels;

namespace UsersApi.Business.User.Queries.GetUserInfoByUserId
{
    public interface IGetUserInfoByUserIdQuery
    {
        Task<UserInfoViewModel> ExecuteAsync(int userId);
    }
}