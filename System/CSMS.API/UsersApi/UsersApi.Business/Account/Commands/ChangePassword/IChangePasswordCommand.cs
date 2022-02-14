using System.Threading.Tasks;
using UsersApi.Business.Account.ViewModes;
using UsersApi.Common.Commands;

namespace UsersApi.Business.Account.Commands.ChangePassword
{
    public interface IChangePasswordCommand
    {
        Task<CommandResult> ExecuteAsync(ChangePasswordViewModel model);
    }
}