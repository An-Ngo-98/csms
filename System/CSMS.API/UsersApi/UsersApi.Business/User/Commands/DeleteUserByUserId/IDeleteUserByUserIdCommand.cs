using System.Threading.Tasks;
using UsersApi.Common.Commands;

namespace UsersApi.Business.User.Commands.DeleteUserByUserId
{
    public interface IDeleteUserByUserIdCommand
    {
        Task<CommandResult> ExecuteAsync(int userId);
    }
}