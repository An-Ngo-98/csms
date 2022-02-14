using System.Threading.Tasks;
using UsersApi.Business.Customer.ViewModels;

namespace UsersApi.Business.Account.Queries.GetCustomerInfoFromAccessToken
{
    public interface IGetCustomerInfoFromAccessTokenQuery
    {
        Task<CustomerViewModel> ExecuteAsync(string accessToken);
    }
}