using System.Threading.Tasks;
using UsersApi.Common.Commands;

namespace UsersApi.Business.User.Commands.DeleteUserAddressByAddressId
{
    public interface IDeleteUserAddressByAddressIdCommand
    {
        Task<CommandResult> ExecuteAsync(int addressId);
    }
}