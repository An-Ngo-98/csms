using System.Threading.Tasks;
using UsersApi.Business.User.ViewModels;
using UsersApi.Common.Commands;

namespace UsersApi.Business.User.Commands.SaveUser
{
    public interface ISaveUserCommand
    {
        Task<CommandResult> ExecuteAsync(SaveUserViewModel model);
    }
}