using System.Threading.Tasks;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Common.Commands;

namespace UsersApi.Business.Customer.Commands.SaveCustomer
{
    public interface ISaveCustomerCommand
    {
        Task<CommandResult> ExecuteAsync(SaveCustomerViewModel model);
        Task<CommandResult> ExecuteSocialAsync(SaveCustomerSocialViewModel model);
    }
}