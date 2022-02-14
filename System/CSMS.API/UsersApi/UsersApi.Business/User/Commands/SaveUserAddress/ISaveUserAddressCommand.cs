using System.Threading.Tasks;
using UsersApi.Business.User.ViewModels;
using UsersApi.Common.Commands;
using UsersApi.Data.Entities;

namespace UsersApi.Business.User.Commands.SaveUserAddress
{
    public interface ISaveUserAddressCommand
    {
        Task<CommandResult> ExecuteAsync(CsmsUserAddress model);
    }
}