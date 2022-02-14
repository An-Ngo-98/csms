using CdnApi.Business.User.ViewModels;
using System.Threading.Tasks;

namespace CdnApi.Business.User.Queries.GetUserAvatar
{
    public interface IGetUserAvatarQuery
    {
        Task<UserAvatarViewModel> ExecuteAsync(int userId);
        Task<UserAvatarViewModel> ExecuteAndSaveCacheAsync(int userId);
    }
}