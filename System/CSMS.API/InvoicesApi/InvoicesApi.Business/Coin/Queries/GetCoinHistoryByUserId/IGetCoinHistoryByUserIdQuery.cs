using InvoicesApi.Business.Coin.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InvoicesApi.Business.Coin.Queries.GetCoinHistoryByUserId
{
    public interface IGetCoinHistoryByUserIdQuery
    {
        Task<List<CoinHistoryViewModel>> ExecuteAsync(int userId);
    }
}