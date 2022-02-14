using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Customer.Queries.GetListAddressByUserId
{
    public class GetListAddressByUserIdQuery : IGetListAddressByUserIdQuery
    {
        private readonly IRepository<CsmsUserAddress> _addressRepository;

        public GetListAddressByUserIdQuery(IRepository<CsmsUserAddress> addressRepository)
        {
            _addressRepository = addressRepository;
        }

        public async Task<List<AddressViewModel>> ExecuteAsync(int userId)
        {
            var result = await _addressRepository.TableNoTracking
                .Where(n => n.UserId == userId)
                .Select(n => new AddressViewModel()
                {
                    Id = n.Id,
                    UserId = n.UserId ?? userId,
                    Receiver = n.Receiver,
                    PhoneNumber = n.PhoneNumber,
                    Country = n.Country,
                    Province = n.Province,
                    District = n.District,
                    Ward = n.Ward,
                    Detail = n.Detail,
                    IsDefault = n.IsDefault ?? false
                })
                .ToListAsync();

            return result;
        }
    }
}
