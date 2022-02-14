using System.Threading.Tasks;
using UsersApi.Business.Account.ViewModes;

namespace UsersApi.Business.Account.Queries.GetCustomerByAccount
{
    public interface IGetCustomerByAccountQuery
    {
        Task<UserLoginViewModel> ExecuteAsync(string username, string inputPassword);
    }
}