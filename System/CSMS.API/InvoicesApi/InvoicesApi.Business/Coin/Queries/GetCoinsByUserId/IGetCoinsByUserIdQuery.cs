using System.Threading.Tasks;

namespace InvoicesApi.Business.Coin.Queries.GetCoinsByUserId
{
    public interface IGetCoinsByUserIdQuery
    {
        Task<int> ExecuteAsync(int userId);
    }
}