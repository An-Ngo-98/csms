using System.Collections.Generic;
using System.Threading.Tasks;
using UsersApi.Business.Customer.ViewModels;

namespace UsersApi.Business.Customer.Queries.GetListAddressByUserId
{
    public interface IGetListAddressByUserIdQuery
    {
        Task<List<AddressViewModel>> ExecuteAsync(int userId);
    }
}