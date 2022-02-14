using InvoicesApi.Business.Coin.ViewModels;
using InvoicesApi.Data.Entities;
using InvoicesApi.Data.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Coin.Queries.GetCoinHistoryByUserId
{
    public class GetCoinHistoryByUserIdQuery : IGetCoinHistoryByUserIdQuery
    {
        private readonly IRepository<CsmsOrder> _orderRepository;

        public GetCoinHistoryByUserIdQuery(IRepository<CsmsOrder> orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<List<CoinHistoryViewModel>> ExecuteAsync(int userId)
        {
            var result = await (
                    _orderRepository.TableNoTracking
                    .Where(n => n.UserId == userId && n.UsedCoins > 0)
                    .Select(n => new CoinHistoryViewModel()
                    {
                        InvoiceId = n.Id,
                        Coins = n.UsedCoins,
                        Time = n.OrderedTime,
                        isUsed = true,
                        isEarned = false
                    })
                ).Union(
                    _orderRepository.TableNoTracking
                    .Where(n => n.UserId == userId && n.CompletedTime != null)
                    .Select(n => new CoinHistoryViewModel()
                    {
                        InvoiceId = n.Id,
                        Coins = n.EarnedCoins,
                        Time = n.OrderedTime,
                        isUsed = false,
                        isEarned = true
                    })
                )
                .OrderByDescending(n => n.Time)
                .ToListAsync();

            //List<CoinHistoryViewModel> result = new List<CoinHistoryViewModel>();

            //foreach (var order in data.Result)
            //{
            //    if (order.UsedCoins > 0)
            //    {
            //        result.Add(new CoinHistoryViewModel()
            //        {
            //            InvoiceId = order.Id,
            //            Coins = order.UsedCoins,
            //            Time = order.OrderedTime,
            //            ísUsed = true
            //        });
            //    }
            //    if (order.CompletedTime != null)
            //    {
            //        result.Add(new CoinHistoryViewModel()
            //        {
            //            InvoiceId = order.Id,
            //            Coins = order.EarnedCoins,
            //            Time = order.OrderedTime,
            //            ísUsed = false
            //        });
            //    }
            //}

            return result;
        }
    }
}
