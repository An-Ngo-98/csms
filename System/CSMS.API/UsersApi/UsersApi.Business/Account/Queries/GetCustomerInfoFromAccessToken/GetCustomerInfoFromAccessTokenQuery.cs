using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using UsersApi.Business.Customer.ViewModels;
using UsersApi.Data.Entities;
using UsersApi.Data.Services;

namespace UsersApi.Business.Account.Queries.GetCustomerInfoFromAccessToken
{
    public class GetCustomerInfoFromAccessTokenQuery : IGetCustomerInfoFromAccessTokenQuery
    {
        private readonly IRepository<CsmsUser> _userRepository;

        public GetCustomerInfoFromAccessTokenQuery(IRepository<CsmsUser> userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<CustomerViewModel> ExecuteAsync(string accessToken)
        {
            accessToken = accessToken?.Replace("Bearer", "").Trim();
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(accessToken);
            var id = jwtToken.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sub).Value;
            var user = await _userRepository.TableNoTracking
                .Where(n => n.Id.ToString() == id)
                .Select(n => new CustomerViewModel()
                {
                    Id = n.Id,
                    FirstName = n.FirstName,
                    MiddleName = n.MiddleName,
                    LastName = n.LastName,
                    Birthday = n.Birthday,
                    Email = n.Email,
                    PhoneNumber = n.PhoneNumber,
                    Gender = n.Gender,
                    CreatedDate = n.CreateDate
                })
                .SingleOrDefaultAsync();

            return user;
        }
    }
}
