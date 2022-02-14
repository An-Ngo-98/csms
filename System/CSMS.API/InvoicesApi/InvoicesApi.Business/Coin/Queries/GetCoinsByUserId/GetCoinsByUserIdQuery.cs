using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Coin.Queries.GetCoinsByUserId
{
    public class GetCoinsByUserIdQuery : IGetCoinsByUserIdQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetCoinsByUserIdQuery(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<int> ExecuteAsync(int userId)
        {
            var data = await _orderRepository.TableNoTracking
                .Where(n => n.UserId == userId)
                .GroupBy(n => n.UserId)
                .Select(n => new
                {
                    Earned = n.Sum(x => x.CompletedTime == null ? 0 : x.EarnedCoins),
                    Used = n.Sum(x => x.UsedCoins),
                })
                .SingleOrDefaultAsync();

            int result = data != null ? data.Earned - data.Used : 0;
            result = result < 0 ? 0 : result;

            return result;
        }
    }
}
